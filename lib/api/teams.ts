const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export interface Team {
  _id?: string
  name: string
  members: string[]
  league: string
  logo?: string
  coach: string
  captain: string
  achievements?: Array<{
    title: string
    description: string
    date: string
  }>
  leagueHistory?: Array<{
    league: string
    position: number
    points: number
  }>
  status: string
  matches: string[]
  postedBy: string
  editedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface TeamRegistrationData {
  name: string
  coach: string
  captain: string
  members: string[]
  contactEmail: string
  contactPhone: string
  leagueId: string
}

export const teamsApi = {
  // Register a new team
  async registerTeam(teamData: TeamRegistrationData): Promise<Team> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/teams/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(teamData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to register team')
    }
    
    return response.json()
  },

  // Get all teams
  async getTeams(): Promise<Team[]> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/teams`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch teams')
    }
    
    return response.json()
  },

  // Get teams by league
  async getTeamsByLeague(leagueId: string): Promise<Team[]> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/teams/league/${leagueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch league teams')
    }
    
    return response.json()
  },

  // Get single team
  async getTeam(id: string): Promise<Team> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch team details')
    }
    
    return response.json()
  },

  // Update team (admin or team owner only)
  async updateTeam(id: string, teamData: Partial<Team>): Promise<Team> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(teamData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update team')
    }
    
    return response.json()
  },

  // Delete team (admin only)
  async deleteTeam(id: string): Promise<void> {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/teams/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete team')
    }
  },
}
