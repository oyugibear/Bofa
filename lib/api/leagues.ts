import { League } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const leaguesApi = {
  // Get all leagues (public access for display)
  async getLeagues(): Promise<League[]> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      // If unauthorized, return empty array for public viewing
      if (response.status === 401) {
        console.warn('No authentication provided for leagues - showing empty list')
        return []
      }
      throw new Error(`Failed to fetch leagues: ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.data || data || [] // Handle different API response formats
  },

  // Get single league with full details
  async getLeague(id: string): Promise<League> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch league details')
    }
    
    return response.json()
  },

  // Create new league (admin only)
  async createLeague(leagueData: Partial<League>): Promise<League> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(leagueData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create league')
    }
    
    return response.json()
  },

  // Update league (admin only)
  async updateLeague(id: string, leagueData: Partial<League>): Promise<League> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(leagueData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update league')
    }
    
    return response.json()
  },

  // Delete league (admin only)
  async deleteLeague(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete league')
    }
  },

  // Generate matches for league (admin only)
  async generateMatches(data: {
    leagueId: string
    numberOfMatches: number
    startDate?: string
    venue: string
    postedBy: string
  }): Promise<any> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues/generateMatches`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to generate matches')
    }
    
    return response.json()
  },

  // Initialize league standings (admin only)
  async initializeStandings(leagueId: string): Promise<any> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues/standings/initialize/${leagueId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to initialize standings')
    }
    
    return response.json()
  },

  // Recalculate league standings (admin only)
  async recalculateStandings(leagueId: string): Promise<any> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/leagues/standings/recalculate/${leagueId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to recalculate standings')
    }
    
    return response.json()
  },
}
