"use client"

/**
 * Global reset functionality for the entire Buckled.io app
 * This clears all localStorage data across all sections
 */
export function resetAllAppData() {
  if (typeof window !== "undefined") {
    // Clear all localStorage data
    localStorage.clear()

    // Also clear any specific keys that might be used
    const keysToRemove = [
      "app-cache",
      "selectedCar",
      "problemDescription",
      "uploadedFiles",
      "uploadedQuoteFiles",
      "isSignedUp",
      "selectedDate",
      "selectedTime",
      "externalSocketMessages",
      "socketVisible",
      "shouldOpenChat",
      "showContinueButton",
      "continueButtonText",
      "rfpSent",
      "proposalReady",
      "diagnosisProgress",
      "showDiagnosisResults",
      "selectedQuote",
    ]

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key)
    })

    // Clear any session storage as well
    sessionStorage.clear()

    console.log("[v0] All app data has been reset")
  }
}
