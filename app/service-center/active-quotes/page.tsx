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
import { useActiveQuotes } from "@/hooks/use-service-center-data"
import { formatTimeAgo } from "@/lib/utils"
import Link from "next/link"
import { ArrowLeft, Search, Filter, DollarSign, Clock, Eye, CheckCircle, XCircle, MoreHorizontal } from "lucide-react"

export default function ActiveQuotesPage() {
  const { quotes, updateQuote } = useActiveQuotes()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")

  // Filter and sort quotes
  const filteredQuotes = useMemo(() => {
    const filtered = quotes.filter((quote) => {
      const matchesSearch =
        quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.carInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.serviceType.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || quote.status === statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort quotes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
        case "oldest":
          return new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
        case "amount":
          return b.totalCost - a.totalCost
        case "customer":
          return a.customerName.localeCompare(b.customerName)
        case "expires":
          return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [quotes, searchTerm, statusFilter, sortBy])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "viewed":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "declined":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Clock className="w-4 h-4" />
      case "viewed":
        return <Eye className="w-4 h-4" />
      case "approved":
        return <CheckCircle className="w-4 h-4" />
      case "declined":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const formatExpiresIn = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours} hours`
    } else {
      return `${Math.floor(diffInHours / 24)} days`
    }
  }

  const handleFollowUp = (quoteId: string) => {
    console.log("Following up on quote:", quoteId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-white">
      {/* Header */}
      <div className="border-b">
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Active Quotes</h1>
                <p className="text-gray-600 text-sm sm:text-base">Track quotes sent to customers</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredQuotes.length} of {quotes.length} quotes
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
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${quotes.reduce((sum, quote) => sum + quote.totalCost, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {quotes.filter((q) => q.status === "approved").length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {quotes.filter((q) => q.status === "sent" || q.status === "viewed").length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Declined</p>
                <p className="text-2xl font-bold text-red-600">
                  {quotes.filter((q) => q.status === "declined").length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
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
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="viewed">Viewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount">By Amount</SelectItem>
                  <SelectItem value="customer">By Customer</SelectItem>
                  <SelectItem value="expires">By Expiration</SelectItem>
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
                  <TableHead>Quote Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-gray-50">
                    <TableCell>
                      <ExpandableText text={quote.customerName} className="font-medium text-gray-900" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <ExpandableText text={quote.carInfo} className="font-medium" />
                        <ExpandableText text={quote.serviceType} className="text-sm text-gray-600 block mt-1" />
                        <div className="text-sm text-gray-500">{quote.estimatedDuration}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-bold text-lg">${quote.totalCost.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">
                          Labor: ${quote.laborCost} | Parts: ${quote.partsCost}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(quote.status)} flex items-center gap-1 w-fit`}>
                        {getStatusIcon(quote.status)}
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{formatTimeAgo(quote.sentAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">{formatExpiresIn(quote.expiresAt)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {quote.status === "sent" || quote.status === "viewed" ? (
                          <Button size="sm" variant="outline" onClick={() => handleFollowUp(quote.id)}>
                            Follow Up
                          </Button>
                        ) : null}
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

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No quotes found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Quotes will appear here when you respond to requests"}
              </div>
            </div>
          )}
        </Card>

        {/* Mobile Cards - Hidden on desktop */}
        <div className="lg:hidden space-y-4">
          {filteredQuotes.map((quote) => (
            <Card key={quote.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{quote.customerName}</h3>
                  <p className="text-sm text-gray-600">{quote.carInfo}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {quote.status === "sent" || quote.status === "viewed" ? (
                      <DropdownMenuItem onClick={() => handleFollowUp(quote.id)}>Follow Up</DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Service:</span>
                  <span className="text-sm font-medium">{quote.serviceType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="text-sm">{quote.estimatedDuration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-lg font-bold">${quote.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Labor/Parts:</span>
                  <span className="text-sm">
                    ${quote.laborCost} / ${quote.partsCost}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(quote.status)} flex items-center gap-1`}>
                  {getStatusIcon(quote.status)}
                  {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                </Badge>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Sent {formatTimeAgo(quote.sentAt)}</div>
                  <div className="text-xs text-gray-500">Expires in {formatExpiresIn(quote.expiresAt)}</div>
                </div>
              </div>
            </Card>
          ))}

          {filteredQuotes.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No quotes found</div>
              <div className="text-sm text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Quotes will appear here when you respond to requests"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
