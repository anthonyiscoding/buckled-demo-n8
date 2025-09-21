"use client"
// SWR localStorage provider as specified in requirements
export function localStorageProvider(): Map<string, any> {
  const map = new Map()

  // Clean up any existing event listeners
  const existingHandler = (window as any)._swrBeforeUnloadHandler
  if (existingHandler) {
    window.removeEventListener('beforeunload', existingHandler)
  }

  // Load data from localStorage on initialization
  if (typeof window !== 'undefined') {
    try {
      const cachedData = localStorage.getItem('app-cache')
      if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        if (Array.isArray(parsedData)) {
          // Restore the Map from the stored array format
          for (const [key, value] of parsedData) {
            if (value && typeof value === 'object' && value.data !== undefined) {
              map.set(key, value.data)
            } else {
              map.set(key, value)
            }
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load SWR cache from localStorage:', error)
    }
  }

  // Save data to localStorage on page unload
  const beforeUnloadHandler = () => {
    if (typeof window !== 'undefined') {
      try {
        const dataToStore = Array.from(map.entries()).map(([key, value]) => [
          key,
          { _k: key, data: value }
        ])
        localStorage.setItem('app-cache', JSON.stringify(dataToStore))
      } catch (error) {
        console.warn('Failed to save SWR cache to localStorage:', error)
      }
    }
  }

    // Store reference to handler for cleanup
    ; (window as any)._swrBeforeUnloadHandler = beforeUnloadHandler
  window.addEventListener('beforeunload', beforeUnloadHandler)

  return map
}
