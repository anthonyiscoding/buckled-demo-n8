"use client"
// SWR localStorage provider as specified in requirements
function localStorageProvider() {
  // Check if we're running in the browser
  if (typeof window === 'undefined') {
    // On server-side, return empty map
    return new Map<string, any>()
  }

  // When initializing, we restore the data from `localStorage` into a map.
  // If localStorage is empty (after reset), this will be an empty array
  const stored = localStorage.getItem('app-cache') || '[]'
  const map = new Map<string, any>(JSON.parse(stored))

  // Before unloading the app, we write back all the data into `localStorage`.
  const handleBeforeUnload = () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  }

  // Remove any existing listener to prevent duplicates
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('beforeunload', handleBeforeUnload)

  // We still use the map for write & read for performance.
  return map
}

export { localStorageProvider }
