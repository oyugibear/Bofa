// API Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1' // Update this to match your API URL

// Types for API responses
export interface ApiResponse<T = any> {
  status: boolean
  message: string
  data?: T
  error?: string
}

export interface User {
  _id: string
  first_name: string
  second_name: string
  email: string
  phone_number: string
  date_of_birth: string
  role: string
  therapy_notes?: Array<{
    note: string
    createdAt: string
    postedBy: {
      ref: string
    }
  }>
  createdAt: string
  updatedAt: string
  __v: number
}

export interface LoginResponse {
  user: User
  token: string
}

export interface RegisterResponse extends User {}

// Auth API functions
export const authAPI = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Login failed')
      }

      // Return the data directly since the API response format is { status, message, user, token }
      return {
        user: data.user,
        token: data.token
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error')
    }
  },

  async register(userData: {
    first_name: string
    second_name: string
    email: string
    phone_number: string
    date_of_birth: string
    password: string
    role: string
  }): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      return data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error')
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      return data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error')
    }
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          confirmationCode: code, 
          newPassword 
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      return data
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error')
    }
  }
}

// Storage utilities for auth tokens with encryption
class SecureStorage {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USER_KEY = 'user_data'
  private static readonly EXPIRY_KEY = 'token_expiry'
  
  // Simple encryption (in production, use a proper encryption library)
  private static encrypt(data: string): string {
    if (typeof window === 'undefined') return data
    return btoa(encodeURIComponent(data))
  }
  
  private static decrypt(data: string): string {
    if (typeof window === 'undefined') return data
    try {
      return decodeURIComponent(atob(data))
    } catch {
      return data
    }
  }
  
  private static isExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const expiry = localStorage.getItem(this.EXPIRY_KEY)
    if (!expiry) return true
    
    return Date.now() > parseInt(expiry)
  }
  
  static setToken(token: string): void {
    console.log('🔑 setToken() called with:', {
      tokenProvided: !!token,
      tokenType: typeof token,
      tokenLength: token?.length,
      isWindow: typeof window !== 'undefined',
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    })
    
    if (typeof window === 'undefined') {
      console.log('❌ setToken() aborted: window undefined (SSR)')
      return
    }
    
    if (!token || token === 'undefined' || token === 'null') {
      console.log('❌ setToken() aborted: invalid token provided')
      return
    }
    
    // Set token expiry to 24 hours
    const expiry = Date.now() + (24 * 60 * 60 * 1000)
    
    try {
      console.log('🔐 Encrypting token...')
      const encrypted = this.encrypt(token)
      
      console.log('💾 Storing to localStorage...')
      localStorage.setItem(this.TOKEN_KEY, encrypted)
      localStorage.setItem(this.EXPIRY_KEY, expiry.toString())
      
      console.log('✅ setToken() success:', {
        originalTokenLength: token?.length,
        encryptedTokenLength: encrypted?.length,
        tokenKey: this.TOKEN_KEY,
        expiry: expiry,
        expiryDate: new Date(expiry).toISOString()
      })
      
      // Immediately verify storage
      const retrieved = localStorage.getItem(this.TOKEN_KEY)
      const retrievedExpiry = localStorage.getItem(this.EXPIRY_KEY)
      console.log('🔍 setToken() verification:', {
        tokenWasStored: !!retrieved,
        expiryWasStored: !!retrievedExpiry,
        tokenStoredLength: retrieved?.length,
        tokenMatches: retrieved === encrypted,
        allLocalStorageKeys: Object.keys(localStorage)
      })
      
      // Double check by trying to retrieve
      setTimeout(() => {
        const testRetrieve = localStorage.getItem(this.TOKEN_KEY)
        console.log('⏱️ setToken() delayed verification (100ms):', {
          stillThere: !!testRetrieve,
          length: testRetrieve?.length
        })
      }, 100)
      
    } catch (error) {
      console.error('💥 setToken() failed:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
    }
  }
  
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    if (this.isExpired()) {
      console.log('Token expired, clearing all auth data')
      this.clearAll()
      return null
    }
    
    const encryptedToken = localStorage.getItem(this.TOKEN_KEY)
    console.log('getToken() debug:', {
      hasEncryptedToken: !!encryptedToken,
      encryptedTokenLength: encryptedToken?.length,
      tokenKey: this.TOKEN_KEY
    })
    
    if (!encryptedToken) return null
    
    try {
      const decryptedToken = this.decrypt(encryptedToken)
      console.log('Token decryption success:', {
        decryptedTokenLength: decryptedToken?.length,
        tokenExists: !!decryptedToken
      })
      return decryptedToken
    } catch (error) {
      console.error('Token decryption failed:', error)
      this.clearAll()
      return null
    }
  }
  
  static setUser(user: User): void {
    if (typeof window === 'undefined') return
    
    // Remove sensitive data before storing
    const sanitizedUser = {
      _id: user._id,
      first_name: user.first_name,
      second_name: user.second_name,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      createdAt: user.createdAt
    }
    
    localStorage.setItem(this.USER_KEY, this.encrypt(JSON.stringify(sanitizedUser)))
  }
  
  static getUser(): User | null {
    if (typeof window === 'undefined') return null
    
    if (this.isExpired()) {
      this.clearAll()
      return null
    }
    
    const userData = localStorage.getItem(this.USER_KEY)
    if (!userData) return null
    
    try {
      return JSON.parse(this.decrypt(userData))
    } catch {
      return null
    }
  }
  
  static clearAll(): void {
    if (typeof window === 'undefined') return
    
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.EXPIRY_KEY)
  }
  
  static isAuthenticated(): boolean {
    const hasToken = !!this.getToken()
    const hasUser = !!this.getUser()
    const notExpired = !this.isExpired()
    const result = hasToken && hasUser && notExpired
    
    if (process.env.NODE_ENV === 'development') {
      console.log('authStorage.isAuthenticated()', {
        hasToken,
        hasUser,
        notExpired,
        result,
        // expiry: localStorage.getItem(this.EXPIRY_KEY),
        currentTime: Date.now()
      })
    }
    
    return result
  }
}

export const authStorage = SecureStorage
