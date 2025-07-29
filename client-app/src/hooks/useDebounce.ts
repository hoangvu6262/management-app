import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook that debounces a value
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Set a timer to update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup function to cancel the timeout if value or delay changes
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Advanced debounce hook with cancel functionality
 * @param callback - Function to call after debounce
 * @param delay - Debounce delay in milliseconds
 * @returns Object with debouncedCallback and cancel function
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args)
      }, delay)
    },
    [delay]
  )

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return { debouncedCallback, cancel }
}

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param onSearch - Callback function called when search term changes
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Object containing searchTerm, debouncedSearchTerm, and setSearchTerm
 */
export function useDebounceSearch(
  initialValue: string = '',
  onSearch: (searchTerm: string) => void,
  delay: number = 500
) {
  const [searchTerm, setSearchTerm] = useState(initialValue)
  const debouncedSearchTerm = useDebounce(searchTerm, delay)

  // Update local state when initialValue changes (e.g., from external filter changes)
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue)
    }
  }, [initialValue])

  useEffect(() => {
    onSearch(debouncedSearchTerm)
  }, [debouncedSearchTerm, onSearch])

  return {
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
  }
}
