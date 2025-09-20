"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useServiceCenterDashboard } from "@/hooks/use-service-center-data"
import Link from "next/link"
import {
  Clock,
  FileText,
  Calendar,
  Star,
  DollarSign,
  TrendingUp,
  User,
  Settings,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function ServiceCenterPage() {
  const { stats, requests, quotes, services, reviews, revenueData } = useServiceCenterDashboard()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getRecentActivity = () => {
    const activities = [
      ...requests.slice(0, 2).map((req) => ({
        id: req.id,
        type: "request",
        title: `New request from ${req.customerName}`,
        subtitle: `${req.carYear} ${req.carMake} ${req.carModel} - ${req.problemDescription.substring(0, 50)}...`,
        time: req.submittedAt,
        urgency: req.urgency,
      })),
      ...quotes
        .filter((q) => q.status === "approved")
        .slice(0, 1)
        .map((quote) => ({
          id: quote.id,
          type: "quote",
          title: `Quote approved by ${quote.customerName}`,
          subtitle: `${quote.carInfo} - ${quote.serviceType}`,
          time: quote.sentAt,
          urgency: "medium",
        })),
      ...services
        .filter((s) => s.status === "completed")
        .slice(0, 1)
        .map((service) => ({
          id: service.id,
          type: "service",
          title: `Service completed for ${service.customerName}`,
          subtitle: `${service.carInfo} - ${service.serviceType}`,
          time: service.scheduledDate,
          urgency: "low",
        })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 3)

    return activities
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  const recentActivity = getRecentActivity()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-blue-600">
                Buckled.io
              </Link>
              <span className="text-sm text-gray-500">Service Center Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/service-center/profile">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Profile Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Service Center Dashboard</h2>
          <p className="text-gray-600">Manage customer requests, provide quotes, and grow your auto repair business.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+{stats.revenueGrowth.toFixed(1)}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</span>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-sm text-gray-500">from {stats.totalReviews} reviews</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Quotes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeQuotes}</p>
                <p className="text-sm text-gray-500">{quotes.filter((q) => q.status === "approved").length} approved</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.scheduledServices}</p>
                <p className="text-sm text-gray-500">
                  {services.filter((s) => s.status === "in-progress").length} in progress
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </Card>
        </div>

        {/* Revenue Chart */}
        <Card className="p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(value as number), "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Pending Requests */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-medium">{stats.pendingRequests}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">New customer requests waiting for your response</p>
            <div className="space-y-2 mb-4">
              {requests.slice(0, 2).map((request) => (
                <div key={request.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">{request.customerName}</span>
                  <div className="flex items-center gap-1">
                    {request.urgency === "high" && <AlertTriangle className="w-3 h-3 text-red-500" />}
                    {request.urgency === "medium" && <Clock className="w-3 h-3 text-yellow-500" />}
                    {request.urgency === "low" && <CheckCircle className="w-3 h-3 text-green-500" />}
                    <span className="text-gray-500">{formatTimeAgo(request.submittedAt)}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/service-center/pending-requests">
              <Button className="w-full bg-transparent" variant="outline">
                View All Requests
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* Active Quotes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Quotes</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">{stats.activeQuotes}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Quotes sent to customers awaiting approval</p>
            <div className="space-y-2 mb-4">
              {quotes.slice(0, 2).map((quote) => (
                <div key={quote.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">{quote.customerName}</span>
                  <div className="flex items-center gap-2">
                    {quote.status === "viewed" && <Eye className="w-3 h-3 text-blue-500" />}
                    {quote.status === "approved" && <CheckCircle className="w-3 h-3 text-green-500" />}
                    <span className="font-medium">{formatCurrency(quote.totalCost)}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/service-center/active-quotes">
              <Button className="w-full bg-transparent" variant="outline">
                Manage Quotes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* Scheduled Services */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Scheduled Services</h3>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">{stats.scheduledServices}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">Upcoming appointments and service bookings</p>
            <div className="space-y-2 mb-4">
              {services.slice(0, 2).map((service) => (
                <div key={service.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">{service.customerName}</span>
                  <div className="flex items-center gap-2">
                    {service.status === "in-progress" && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                    {service.status === "completed" && <CheckCircle className="w-3 h-3 text-green-500" />}
                    <span className="text-gray-500">{new Date(service.scheduledDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/service-center/scheduled-services">
              <Button className="w-full bg-transparent" variant="outline">
                View Schedule
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.subtitle}</p>
                  </div>
                  <span className="text-sm text-gray-500">{formatTimeAgo(activity.time)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/service-center/customer-reviews">
                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    View Customer Reviews
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/service-center/profile">
                <Button className="w-full justify-between bg-transparent" variant="outline">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Update Profile
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button className="w-full justify-between bg-transparent" variant="outline">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </div>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
