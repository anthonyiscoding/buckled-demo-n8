"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ExpandableText } from "@/components/ui/expandable-text"
import { useScheduledServices } from "@/hooks/use-service-center-data"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Filter,
  Calendar,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  XCircle,
  MoreHorizontal,
} from "lucide-react"

export default function ScheduledServicesPage() {
  const { services, updateService } = useScheduledServices()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")

  // Filter and sort services
  const filteredServices = useMemo(() => {
    const filtered = services.filter((service) => {
      const matchesSearch =
        service.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.carInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceType.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || service.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort services
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        case "customer":
          return a.customerName.localeCompare(b.customerName)
        case "amount":
          return b.totalCost - a.totalCost
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    return filtered
  }, [services, searchTerm, statusFilter, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Calendar className="w-4 h-4" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const formatDate = (date: Date) => {
    date = new Date(date)
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  const isToday = (date: Date) => {
    date = new Date(date)
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isTomorrow = (date: Date) => {
    date = new Date(date)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return date.toDateString() === tomorrow.toDateString()
  }

  const handleStatusUpdate = (serviceId: string, newStatus: string) => {
    updateService(serviceId, { status: newStatus as any })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-white">
      {/* Header */}
      <div className="border-b ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/service-center">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Scheduled Services</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage upcoming appointments and services</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredServices.length} of {services.length} services
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-2xl font-bold text-blue-600">
                  {services.filter((s) => isToday(s.scheduledDate)).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tomorrow</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter((s) => isTomorrow(s.scheduledDate)).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {services.filter((s) => s.status === "in-progress").length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter((s) => s.status === "completed").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by customer, car, or service type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="customer">By Customer</SelectItem>
                  <SelectItem value="amount">By Amount</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Desktop Table - Hidden on mobile */}
        <Card className="hidden lg:block">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle & Service</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <ExpandableText text={service.customerName} className="font-medium text-gray-900" />
                        <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          <ExpandableText text={service.customerPhone} className="" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <ExpandableText text={service.carInfo} className="font-medium" />
                        <ExpandableText text={service.serviceType} className="text-sm text-gray-600 block mt-1" />
                        {service.notes && (
                          <ExpandableText text={service.notes} className="text-sm text-gray-500 italic block mt-1" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div
                          className={`font-medium ${isToday(service.scheduledDate) ? "text-blue-600" : isTomorrow(service.scheduledDate) ? "text-green-600" : "text-gray-900"}`}
                        >
                          {formatDate(service.scheduledDate)}
                        </div>
                        {isToday(service.scheduledDate) && (
                          <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">Today</Badge>
                        )}
                        {isTomorrow(service.scheduledDate) && (
                          <Badge className="bg-green-100 text-green-800 text-xs mt-1">Tomorrow</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.estimatedDuration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-lg">${service.totalCost.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(service.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(service.status)}
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {service.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(service.id, "in-progress")}
                            className="bg-yellow-600 hover:bg-yellow-700"
                          >
                            Start Service
                          </Button>
                        )}
                        {service.status === "in-progress" && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(service.id, "completed")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Complete
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No scheduled services found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Scheduled services will appear here when quotes are approved"}
              </div>
            </div>
          )}
        </Card>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="lg:hidden space-y-4">
          {filteredServices.map((service) => (
            <Card key={service.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{service.customerName}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Phone className="w-3 h-3" />
                    {service.customerPhone}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {service.status === "confirmed" && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "in-progress")}>
                        Start Service
                      </DropdownMenuItem>
                    )}
                    {service.status === "in-progress" && (
                      <DropdownMenuItem onClick={() => handleStatusUpdate(service.id, "completed")}>
                        Complete
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Vehicle:</span>
                  <p className="font-medium">{service.carInfo}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Service:</span>
                  <p className="text-sm">{service.serviceType}</p>
                  {service.notes && <p className="text-sm text-gray-500 italic mt-1">{service.notes}</p>}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-3 h-3" />
                    {service.estimatedDuration}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-lg font-bold">${service.totalCost.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(service.status)} flex items-center gap-1`}>
                  {getStatusIcon(service.status)}
                  {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                </Badge>
                <div className="text-right">
                  <div
                    className={`text-sm font-medium ${isToday(service.scheduledDate) ? "text-blue-600" : isTomorrow(service.scheduledDate) ? "text-green-600" : "text-gray-900"}`}
                  >
                    {formatDate(service.scheduledDate)}
                  </div>
                  {isToday(service.scheduledDate) && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs mt-1">Today</Badge>
                  )}
                  {isTomorrow(service.scheduledDate) && (
                    <Badge className="bg-green-100 text-green-800 text-xs mt-1">Tomorrow</Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No scheduled services found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Scheduled services will appear here when quotes are approved"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
