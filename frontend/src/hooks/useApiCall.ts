import { useState, useCallback, useEffect } from 'react'
import { AxiosError } from 'axios'

interface UseApiCallReturn<T> {
  data: T | null
  loading: boolean
  error: string
  execute: (...args: any[]) => Promise<void>
}

export function useApiCall<T, A extends any[]>(
  apiFunction: (...args: A) => Promise<{ data: T }>,
  dependencies: unknown[] = []
): UseApiCallReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const execute = useCallback(async (...args: A) => {
    setError('')
    setLoading(true)
    try {
      const response = await apiFunction(...args)
      setData(response.data)
    } catch (err: any) {
      const errorMessage = (err as AxiosError)?.response?.data?.error || 'An error occurred'
      setError(typeof errorMessage === 'string' ? errorMessage : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  useEffect(() => {
    if (dependencies.length > 0) {
      execute()
    }
  }, dependencies)

  return { data, loading, error, execute }
}
