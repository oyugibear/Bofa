import { API_URL } from "@/config/api.config"

// API Configuration
const API_BASE_URL = API_URL // Update this to match your API URL

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
      console.warn('🚀 Sending registration request to:', `${API_BASE_URL}/auth/register`)
      console.warn('📤 Request payload:', userData)
      
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      
      console.warn('📥 API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data,
        timestamp: new Date().toISOString()
      })
      
      if (!response.ok) {
        console.warn('❌ Registration failed with status:', response.status)
        console.warn('❌ Error details:', data)
        throw new Error(data.error || data.message || `HTTP ${response.status}: Registration failed`)
      }

      console.warn('✅ Registration successful:', data)
      return data
    } catch (error) {
      console.warn('🚨 Network/Fetch Error:', error)
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
    
    try {
      if (!data || typeof data !== 'string') {
        throw new Error('Invalid data for encryption')
      }
      
      const encoded = encodeURIComponent(data)
      const encrypted = btoa(encoded)
      
      return encrypted
    } catch (error) {
      console.error('encrypt: Failed to encrypt data', {
        error: error instanceof Error ? error.message : error,
        dataLength: data?.length,
        dataType: typeof data
      })
      throw error
    }
  }
  
  private static decrypt(data: string): string {
    if (typeof window === 'undefined') return data
    
    try {
      if (!data || typeof data !== 'string') {
        throw new Error('Invalid data for decryption')
      }
      
      const decoded = atob(data)
      const decrypted = decodeURIComponent(decoded)
      
      return decrypted
    } catch (error) {
      console.error('decrypt: Failed to decrypt data', {
        error: error instanceof Error ? error.message : error,
        dataLength: data?.length,
        dataType: typeof data
      })
      throw error
    }
  }
  
  private static isExpired(): boolean {
    if (typeof window === 'undefined') return true
    
    const expiry = localStorage.getItem(this.EXPIRY_KEY)
    if (!expiry) return true
    
    return Date.now() > parseInt(expiry)
  }
  
  static setToken(token: string): void {
    if (typeof window === 'undefined') return
    
    // Validate token input
    if (!token || typeof token !== 'string' || token.trim() === '') {
      console.error('setToken: Invalid token provided:', { token, type: typeof token })
      return
    }
    
    try {
      // CRITICAL: Force clear any existing auth data to prevent contamination
      console.log('setToken: Clearing existing auth data...')
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      localStorage.removeItem(this.EXPIRY_KEY)
      
      // Wait a moment for localStorage to settle
      const cleanToken = token.trim()
      
      // Set token expiry to 24 hours
      const expiry = Date.now() + (24 * 60 * 60 * 1000)
      
      // Encrypt the token
      console.log('setToken: Encrypting token...')
      const encryptedToken = this.encrypt(cleanToken)
      
      // Store expiry first, then token (order matters)
      console.log('setToken: Storing to localStorage...')
      localStorage.setItem(this.EXPIRY_KEY, expiry.toString())
      localStorage.setItem(this.TOKEN_KEY, encryptedToken)
      
      // Force a small delay to ensure storage completes
      setTimeout(() => {
        const storedToken = localStorage.getItem(this.TOKEN_KEY)
        const storedExpiry = localStorage.getItem(this.EXPIRY_KEY)
        
        console.log('setToken: Storage verification (delayed):', {
          tokenStored: !!storedToken,
          expiryStored: !!storedExpiry,
          tokenMatches: storedToken === encryptedToken,
          expiryMatches: storedExpiry === expiry.toString()
        })
      }, 50)
      
      // Immediately verify the storage worked
      const storedToken = localStorage.getItem(this.TOKEN_KEY)
      const storedExpiry = localStorage.getItem(this.EXPIRY_KEY)
      
      if (!storedToken || !storedExpiry) {
        console.error('setToken: Storage verification failed', {
          tokenStored: !!storedToken,
          expiryStored: !!storedExpiry,
          tokenKey: this.TOKEN_KEY,
          expiryKey: this.EXPIRY_KEY,
          allKeys: Object.keys(localStorage)
        })
        throw new Error('Failed to store token in localStorage')
      }
      
      console.log('setToken: Success', {
        tokenLength: cleanToken.length,
        encryptedLength: encryptedToken.length,
        expiry: new Date(expiry).toISOString(),
        stored: true,
        verified: true
      })
      
    } catch (error) {
      console.error('setToken: Failed to store token', {
        error: error instanceof Error ? error.message : error,
        tokenLength: token?.length,
        tokenPreview: token?.substring(0, 10) + '...'
      })
      
      // Clear any partial data that might have been stored
      try {
        localStorage.removeItem(this.TOKEN_KEY)
        localStorage.removeItem(this.USER_KEY)
        localStorage.removeItem(this.EXPIRY_KEY)
      } catch (cleanupError) {
        console.error('setToken: Cleanup failed', cleanupError)
      }
      
      throw error
    }
  }
  
  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    
    try {
      // Check expiration first
      if (this.isExpired()) {
        console.log('getToken: Token expired, clearing all auth data')
        this.clearAll()
        return null
      }
      
      // Get encrypted token from storage
      const encryptedToken = localStorage.getItem(this.TOKEN_KEY)
      
      if (!encryptedToken) {
        console.log('getToken: No token found in localStorage', {
          tokenKey: this.TOKEN_KEY,
          allKeys: Object.keys(localStorage)
        })
        return null
      }
      
      // Decrypt and return token
      const decryptedToken = this.decrypt(encryptedToken)
      
      if (!decryptedToken) {
        console.error('getToken: Token decryption failed')
        this.clearAll()
        return null
      }
      
      console.log('getToken: Success', {
        encryptedLength: encryptedToken.length,
        decryptedLength: decryptedToken.length,
        tokenPreview: decryptedToken.substring(0, 10) + '...'
      })
      
      return decryptedToken
      
    } catch (error) {
      console.error('getToken: Error retrieving token', error)
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
    
    try {
      // Force clear all auth-related items
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      localStorage.removeItem(this.EXPIRY_KEY)
      
      // Also clear any potential corrupted variations
      const allKeys = Object.keys(localStorage)
      allKeys.forEach(key => {
        if (key.includes('auth') || key.includes('token') || key.includes('user_data')) {
          localStorage.removeItem(key)
        }
      })
      
      console.log('clearAll: Successfully cleared all auth data')
    } catch (error) {
      console.error('clearAll: Error clearing localStorage', error)
      
      // Force clear localStorage if specific removal fails
      try {
        localStorage.clear()
        console.log('clearAll: Force cleared entire localStorage')
      } catch (clearError) {
        console.error('clearAll: Failed to clear localStorage entirely', clearError)
      }
    }
  }
  
  static isAuthenticated(): boolean {
    try {
      const hasToken = !!this.getToken()
      const hasUser = !!this.getUser()
      const notExpired = !this.isExpired()
      const result = hasToken && hasUser && notExpired
      
      console.log('isAuthenticated check:', {
        hasToken,
        hasUser,
        notExpired,
        result
      })
      
      return result
    } catch (error) {
      console.error('isAuthenticated: Error during check', error)
      return false
    }
  }
}

export const authStorage = SecureStorage
