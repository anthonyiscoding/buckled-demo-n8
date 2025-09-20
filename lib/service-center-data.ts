// Service Center data models and SWR hooks
export interface PendingRequest {
  id: string
  customerName: string
  customerEmail: string
  carMake: string
  carModel: string
  carYear: number
  problemDescription: string
  urgency: "low" | "medium" | "high"
  submittedAt: Date
  estimatedResponseTime: string
  photos?: string[]
  location: string
}

export interface ActiveQuote {
  id: string
  requestId: string
  customerName: string
  carInfo: string
  serviceType: string
  laborCost: number
  partsCost: number
  totalCost: number
  status: "sent" | "viewed" | "approved" | "declined"
  sentAt: Date
  expiresAt: Date
  estimatedDuration: string
  description: string
}

export interface ScheduledService {
  id: string
  quoteId: string
  customerName: string
  customerPhone: string
  carInfo: string
  serviceType: string
  scheduledDate: Date
  estimatedDuration: string
  status: "confirmed" | "in-progress" | "completed" | "cancelled"
  totalCost: number
  notes?: string
}

export interface CustomerReview {
  id: string
  customerName: string
  serviceId: string
  rating: number
  comment: string
  serviceType: string
  reviewDate: Date
  carInfo: string
}

export interface ServiceCenterProfile {
  id: string
  businessName: string
  address: string
  phone: string
  email: string
  website?: string
  specialties: string[]
  certifications: string[]
  operatingHours: {
    [key: string]: { open: string; close: string; closed?: boolean }
  }
  description: string
  profileCompleteness: number
}

export interface RevenueData {
  month: string
  revenue: number
  services: number
  avgTicket: number
}

// Default example data
export const defaultPendingRequests: PendingRequest[] = [
  {
    id: "req-001",
    customerName: "John Davis",
    customerEmail: "john.davis@email.com",
    carMake: "Honda",
    carModel: "Civic",
    carYear: 2018,
    problemDescription: "Engine making strange noise when accelerating. Check engine light is on.",
    urgency: "high",
    submittedAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    estimatedResponseTime: "30 minutes",
    location: "Downtown",
    photos: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: "req-002",
    customerName: "Sarah Mitchell",
    customerEmail: "sarah.m@email.com",
    carMake: "Toyota",
    carModel: "Camry",
    carYear: 2020,
    problemDescription: "Brakes feel spongy and making squeaking noise.",
    urgency: "medium",
    submittedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    estimatedResponseTime: "2 hours",
    location: "Westside",
  },
  {
    id: "req-003",
    customerName: "Mike Rodriguez",
    customerEmail: "mike.r@email.com",
    carMake: "Ford",
    carModel: "F-150",
    carYear: 2019,
    problemDescription: "Regular maintenance - oil change and inspection.",
    urgency: "low",
    submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    estimatedResponseTime: "24 hours",
    location: "Eastside",
  },
]

export const defaultActiveQuotes: ActiveQuote[] = [
  {
    id: "quote-001",
    requestId: "req-001",
    customerName: "John Davis",
    carInfo: "2018 Honda Civic",
    serviceType: "Engine Diagnostic & Repair",
    laborCost: 450,
    partsCost: 280,
    totalCost: 730,
    status: "sent",
    sentAt: new Date(Date.now() - 30 * 60 * 1000),
    expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    estimatedDuration: "4-6 hours",
    description: "Engine diagnostic, replace faulty oxygen sensor, clean throttle body",
  },
  {
    id: "quote-002",
    requestId: "req-002",
    customerName: "Sarah Mitchell",
    carInfo: "2020 Toyota Camry",
    serviceType: "Brake Service",
    laborCost: 200,
    partsCost: 180,
    totalCost: 380,
    status: "viewed",
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    estimatedDuration: "2-3 hours",
    description: "Replace front brake pads, resurface rotors, brake fluid flush",
  },
  {
    id: "quote-003",
    requestId: "req-004",
    customerName: "Lisa Chen",
    carInfo: "2017 BMW 3 Series",
    serviceType: "AC Repair",
    laborCost: 320,
    partsCost: 150,
    totalCost: 470,
    status: "approved",
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    estimatedDuration: "3-4 hours",
    description: "AC compressor replacement, system recharge",
  },
]

export const defaultScheduledServices: ScheduledService[] = [
  {
    id: "service-001",
    quoteId: "quote-003",
    customerName: "Lisa Chen",
    customerPhone: "(555) 123-4567",
    carInfo: "2017 BMW 3 Series",
    serviceType: "AC Repair",
    scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    estimatedDuration: "3-4 hours",
    status: "confirmed",
    totalCost: 470,
    notes: "Customer prefers morning appointment",
  },
  {
    id: "service-002",
    quoteId: "quote-005",
    customerName: "Robert Johnson",
    customerPhone: "(555) 987-6543",
    carInfo: "2021 Subaru Outback",
    serviceType: "Transmission Service",
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
    estimatedDuration: "2-3 hours",
    status: "confirmed",
    totalCost: 650,
    notes: "Bring own transmission fluid",
  },
  {
    id: "service-003",
    quoteId: "quote-006",
    customerName: "Emma Wilson",
    customerPhone: "(555) 456-7890",
    carInfo: "2019 Mazda CX-5",
    serviceType: "Oil Change & Inspection",
    scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    estimatedDuration: "1 hour",
    status: "in-progress",
    totalCost: 85,
  },
]

export const defaultCustomerReviews: CustomerReview[] = [
  {
    id: "review-001",
    customerName: "John Davis",
    serviceId: "service-004",
    rating: 5,
    comment: "Excellent service! Fixed my engine problem quickly and professionally.",
    serviceType: "Engine Repair",
    reviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    carInfo: "2018 Honda Civic",
  },
  {
    id: "review-002",
    customerName: "Sarah Mitchell",
    serviceId: "service-005",
    rating: 4,
    comment: "Good work on the brakes. Fair pricing and quick turnaround.",
    serviceType: "Brake Service",
    reviewDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    carInfo: "2020 Toyota Camry",
  },
  {
    id: "review-003",
    customerName: "Mike Rodriguez",
    serviceId: "service-006",
    rating: 5,
    comment: "Always reliable for maintenance. Great customer service.",
    serviceType: "Oil Change",
    reviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    carInfo: "2019 Ford F-150",
  },
]

export const defaultServiceCenterProfile: ServiceCenterProfile = {
  id: "sc-001",
  businessName: "Premier Auto Service",
  address: "123 Main Street, Anytown, ST 12345",
  phone: "(555) 123-AUTO",
  email: "info@premierauto.com",
  website: "www.premierauto.com",
  specialties: ["Engine Repair", "Brake Service", "Transmission", "AC/Heating", "Electrical"],
  certifications: ["ASE Certified", "AAA Approved", "Better Business Bureau A+"],
  operatingHours: {
    monday: { open: "8:00 AM", close: "6:00 PM" },
    tuesday: { open: "8:00 AM", close: "6:00 PM" },
    wednesday: { open: "8:00 AM", close: "6:00 PM" },
    thursday: { open: "8:00 AM", close: "6:00 PM" },
    friday: { open: "8:00 AM", close: "6:00 PM" },
    saturday: { open: "9:00 AM", close: "4:00 PM" },
    sunday: { open: "10:00 AM", close: "3:00 PM" },
  },
  description:
    "Full-service automotive repair shop with over 20 years of experience. We specialize in all makes and models.",
  profileCompleteness: 85,
}

export const defaultRevenueData: RevenueData[] = [
  { month: "Jan", revenue: 18500, services: 45, avgTicket: 411 },
  { month: "Feb", revenue: 21200, services: 52, avgTicket: 408 },
  { month: "Mar", revenue: 19800, services: 48, avgTicket: 413 },
  { month: "Apr", revenue: 23100, services: 58, avgTicket: 398 },
  { month: "May", revenue: 25600, services: 61, avgTicket: 420 },
  { month: "Jun", revenue: 24580, services: 59, avgTicket: 417 },
]
