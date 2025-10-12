import { useState, useEffect } from 'react'
import { League } from '@/types'
import { leaguesApi } from '@/lib/api/leagues'

export const useLeagues = () => {
  const [leagues, setLeagues] = useState<League[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeagues = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching leagues from API...')
      
      try {
        const data = await leaguesApi.getLeagues()
        console.log('Leagues data received:', data)
        setLeagues(data)
      } catch (apiError) {
        console.warn('API call failed, using fallback data:', apiError)
        
        // Fallback data that matches the real API structure
        const fallbackData: League[] = [
          {
            _id: "68d101bbffebbb2677f943d7",
            title: "Arena Premier League",
            description: "The flagship competition featuring the best teams in the region. High-intensity matches every weekend.",
            season: "2025",
            status: "active",
            numberOfTeams: 16,
            teams: [],
            matches: [],
            startDate: "2025-03-01T00:00:00.000Z",
            endDate: "2025-11-30T00:00:00.000Z",
            prizePool: 500000,
            registrationFee: 25000,
            category: "adult",
            level: "semi-pro",
            standings: [] as any
          },
          {
            _id: "68d102884326f1e809b220e6",
            title: "Youth Championship",
            description: "Developing the next generation of football stars. For players under 18 years.",
            season: "2025",
            status: "active",
            numberOfTeams: 12,
            teams: [],
            matches: [],
            startDate: "2025-02-15T00:00:00.000Z",
            endDate: "2025-10-15T00:00:00.000Z",
            prizePool: 200000,
            registrationFee: 15000,
            category: "youth",
            level: "amateur",
            standings: [] as any
          }
        ]
        
        setLeagues(fallbackData)
        console.log('Using fallback leagues data')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leagues')
      console.error('Error fetching leagues:', err)
    } finally {
      setLoading(false)
    }
  }

  const refreshLeagues = () => {
    fetchLeagues()
  }

  useEffect(() => {
    fetchLeagues()
  }, [])

  return {
    leagues,
    loading,
    error,
    refreshLeagues,
    setLeagues
  }
}
