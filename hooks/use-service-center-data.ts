import useSWR from "swr"
import {
  type PendingRequest,
  type ActiveQuote,
  type ScheduledService,
  type CustomerReview,
  type ServiceCenterProfile,
  type RevenueData,
  defaultPendingRequests,
  defaultActiveQuotes,
  defaultScheduledServices,
  defaultCustomerReviews,
  defaultServiceCenterProfile,
  defaultRevenueData,
} from "@/lib/service-center-data"

// SWR hooks for service center data management
export function usePendingRequests() {
  const { data, error, mutate } = useSWR<PendingRequest[]>("pending-requests", null)

  const addRequest = (request: PendingRequest) => {
    mutate([...(data || []), request], false)
  }

  const updateRequest = (id: string, updates: Partial<PendingRequest>) => {
    mutate(data?.map((req) => (req.id === id ? { ...req, ...updates } : req)) || [], false)
  }

  const removeRequest = (id: string) => {
    mutate(data?.filter((req) => req.id !== id) || [], false)
  }

  return {
    requests: data || [],
    isLoading: !error && !data,
    error,
    addRequest,
    updateRequest,
    removeRequest,
    mutate,
  }
}

export function useActiveQuotes() {
  const { data, error, mutate } = useSWR<ActiveQuote[]>("active-quotes", null)

  const addQuote = (quote: ActiveQuote) => {
    mutate([...(data || []), quote], false)
  }

  const updateQuote = (id: string, updates: Partial<ActiveQuote>) => {
    mutate(data?.map((quote) => (quote.id === id ? { ...quote, ...updates } : quote)) || [], false)
  }

  const removeQuote = (id: string) => {
    mutate(data?.filter((quote) => quote.id !== id) || [], false)
  }

  return {
    quotes: data || [],
    isLoading: !error && !data,
    error,
    addQuote,
    updateQuote,
    removeQuote,
    mutate,
  }
}

export function useScheduledServices() {
  const { data, error, mutate } = useSWR<ScheduledService[]>("scheduled-services", null)

  const addService = (service: ScheduledService) => {
    mutate([...(data || []), service], false)
  }

  const updateService = (id: string, updates: Partial<ScheduledService>) => {
    mutate(data?.map((service) => (service.id === id ? { ...service, ...updates } : service)) || [], false)
  }

  const removeService = (id: string) => {
    mutate(data?.filter((service) => service.id !== id) || [], false)
  }

  return {
    services: data || [],
    isLoading: !error && !data,
    error,
    addService,
    updateService,
    removeService,
    mutate,
  }
}

export function useCustomerReviews() {
  const { data, error, mutate } = useSWR<CustomerReview[]>("customer-reviews", null)

  const addReview = (review: CustomerReview) => {
    mutate([...(data || []), review], false)
  }

  const updateReview = (id: string, updates: Partial<CustomerReview>) => {
    mutate(data?.map((review) => (review.id === id ? { ...review, ...updates } : review)) || [], false)
  }

  return {
    reviews: data || [],
    isLoading: !error && !data,
    error,
    addReview,
    updateReview,
    mutate,
  }
}

export function useServiceCenterProfile() {
  const { data, error, mutate } = useSWR<ServiceCenterProfile>("profile", null)

  const updateProfile = (updates: Partial<ServiceCenterProfile>) => {
    mutate({ ...(data || defaultServiceCenterProfile), ...updates }, false)
  }

  return {
    profile: data || defaultServiceCenterProfile,
    isLoading: !error && !data,
    error,
    updateProfile,
    mutate,
  }
}

export function useRevenueData() {
  const { data, error, mutate } = useSWR<RevenueData[]>("revenue-data", null)

  return {
    revenueData: data || [],
    isLoading: !error && !data,
    error,
    mutate,
  }
}

// Combined hook for dashboard overview
export function useServiceCenterDashboard() {
  const { requests } = usePendingRequests()
  const { quotes } = useActiveQuotes()
  const { services } = useScheduledServices()
  const { reviews } = useCustomerReviews()
  const { revenueData } = useRevenueData()

  const stats = {
    pendingRequests: requests.length,
    activeQuotes: quotes.length,
    scheduledServices: services.length,
    averageRating: reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0,
    totalReviews: reviews.length,
    monthlyRevenue: revenueData[revenueData.length - 1]?.revenue || 0,
    revenueGrowth:
      revenueData.length >= 2
        ? ((revenueData[revenueData.length - 1]?.revenue - revenueData[revenueData.length - 2]?.revenue) /
          revenueData[revenueData.length - 2]?.revenue) *
        100
        : 0,
  }

  return {
    stats,
    requests,
    quotes,
    services,
    reviews,
    revenueData,
  }
}
