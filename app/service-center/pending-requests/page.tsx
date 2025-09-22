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
import { ServiceCenterHeader } from "@/components/service-center-header"
import { usePendingRequests } from "@/hooks/use-service-center-data"
import { formatTimeAgo } from "@/lib/utils"
import Link from "next/link"
import {
  ArrowLeft,
  Search,
  Filter,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  MapPin,
  Mail,
} from "lucide-react"

export default function PendingRequestsPage() {
  const { requests, updateRequest } = usePendingRequests()
  const [searchTerm, setSearchTerm] = useState("")
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Filter and sort requests
  const filteredRequests = useMemo(() => {
    const filtered = requests.filter((request) => {
      const matchesSearch =
        request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.carMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.carModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.problemDescription.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesUrgency = urgencyFilter === "all" || request.urgency === urgencyFilter

      return matchesSearch && matchesUrgency
    })

    // Sort requests
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        case "oldest":
          return new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
        case "urgency":
          const urgencyOrder = { high: 3, medium: 2, low: 1 }
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency]
        case "customer":
          return a.customerName.localeCompare(b.customerName)
        default:
          return 0
      }
    })

    return filtered
  }, [requests, searchTerm, urgencyFilter, sortBy])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <Clock className="w-4 h-4" />
      case "low":
        return <CheckCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleRespond = (requestId: string) => {
    // In a real app, this would navigate to a quote creation page
    console.log("Responding to request:", requestId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-white">
      {/* Header */}
      <ServiceCenterHeader title="Pending Requests" subtitle="Manage incoming customer service requests" />

      {/* Breadcrumb/Navigation */}
      <div className="pt-24 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/service-center">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        {/* Stats */}
        <div className="mb-6">
          <div className="text-sm text-gray-500">
            {filteredRequests.length} of {requests.length} requests
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by customer, car, or problem description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="urgency">By Urgency</SelectItem>
                  <SelectItem value="customer">By Customer</SelectItem>
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
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Problem</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Response Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <ExpandableText text={request.customerName} className="font-medium text-gray-900" />
                        <ExpandableText text={request.customerEmail} className="text-sm text-gray-500 block mt-1" />
                        <ExpandableText text={request.location} className="text-sm text-gray-500 block" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <ExpandableText
                        text={`${request.carYear} ${request.carMake} ${request.carModel}`}
                        className="font-medium"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs overflow-x-hidden">
                        <ExpandableText text={request.problemDescription} className="text-sm text-gray-900" />
                        {request.photos && request.photos.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">{request.photos.length} photo(s) attached</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getUrgencyColor(request.urgency)} flex items-center gap-1 w-fit`}>
                        {getUrgencyIcon(request.urgency)}
                        {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatTimeAgo(request.submittedAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{request.estimatedResponseTime}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRespond(request.id)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Respond
                        </Button>
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

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No requests found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || urgencyFilter !== "all" ? "Try adjusting your filters" : "New requests will appear here"}
              </div>
            </div>
          )}
        </Card>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="lg:hidden space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{request.customerName}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                    <Mail className="w-3 h-3" />
                    {request.customerEmail}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-3 h-3" />
                    {request.location}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRespond(request.id)}>Respond</DropdownMenuItem>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-3">
                <div>
                  <span className="text-sm text-gray-600">Vehicle:</span>
                  <p className="font-medium">
                    {request.carYear} {request.carMake} {request.carModel}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Problem:</span>
                  <p className="text-sm text-gray-900 mt-1">{request.problemDescription}</p>
                  {request.photos && request.photos.length > 0 && (
                    <div className="text-xs text-blue-600 mt-1">{request.photos.length} photo(s) attached</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={`${getUrgencyColor(request.urgency)} flex items-center gap-1`}>
                  {getUrgencyIcon(request.urgency)}
                  {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
                </Badge>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Submitted {formatTimeAgo(request.submittedAt)}</div>
                  <div className="text-xs text-gray-500">Response: {request.estimatedResponseTime}</div>
                </div>
              </div>
            </Card>
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No requests found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || urgencyFilter !== "all" ? "Try adjusting your filters" : "New requests will appear here"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
