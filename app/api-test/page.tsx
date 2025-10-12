'use client'

import { useEffect, useState } from 'react'
import { Button } from 'antd'

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testApi = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Testing API connection to:', 'http://localhost:8000/api/v1/leagues')
      const response = await fetch('http://localhost:8000/api/v1/leagues', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status)
      console.log('Response headers:', [...response.headers.entries()])
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      setResult(data)
    } catch (err: any) {
      console.error('API Test Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <Button 
        type="primary" 
        onClick={testApi}
        loading={loading}
        className="mb-4"
      >
        Test API Connection
      </Button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded mb-4">
          <h3 className="font-bold text-red-800">Error:</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {result && (
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="font-bold text-green-800 mb-2">API Response:</h3>
          <pre className="text-sm bg-white p-2 rounded border overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
