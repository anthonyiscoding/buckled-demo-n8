"use client"
// SWR localStorage provider as specified in requirements
function localStorageProvider() {
  // Check if we're running in the browser
  if (typeof window === 'undefined') {
    // On server-side, return empty map
    return new Map<string, any>()
  }

  // When initializing, we restore the data from `localStorage` into a map.
  const map = new Map<string, any>(JSON.parse(localStorage.getItem('app-cache') || '[]'))

  // Before unloading the app, we write back all the data into `localStorage`.
  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('app-cache', appCache)
  })

  // We still use the map for write & read for performance.
  return map
}

export { localStorageProvider }