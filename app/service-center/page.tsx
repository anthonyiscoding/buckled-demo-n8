"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ServiceCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">Buckled.io</h1>
              <span className="text-sm text-gray-500">Service Center Portal</span>
            </div>
            <Button variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Service Center Dashboard
          </h2>
          <p className="text-gray-600">
            Manage customer requests, provide quotes, and grow your auto repair business.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pending Requests */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pending Requests</h3>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-medium">3</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              New customer requests waiting for your response
            </p>
            <Button className="w-full" variant="outline">
              View Requests
            </Button>
          </Card>

          {/* Active Quotes */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Quotes</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">7</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Quotes sent to customers awaiting approval
            </p>
            <Button className="w-full" variant="outline">
              Manage Quotes
            </Button>
          </Card>

          {/* Scheduled Services */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Scheduled Services</h3>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">5</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Upcoming appointments and service bookings
            </p>
            <Button className="w-full" variant="outline">
              View Schedule
            </Button>
          </Card>

          {/* Revenue Overview */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Monthly Revenue</h3>
              <div className="text-green-600 text-sm font-medium">+12%</div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">$24,580</div>
            <p className="text-gray-600 text-sm">
              Revenue for this month
            </p>
          </Card>

          {/* Customer Reviews */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Rating</h3>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">⭐</span>
                <span className="text-sm font-medium">4.8</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Average rating from 127 reviews
            </p>
            <Button className="w-full" variant="outline">
              View Reviews
            </Button>
          </Card>

          {/* Profile Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Service Center Profile</h3>
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Update your business information and services
            </p>
            <Button className="w-full" variant="outline">
              Edit Profile
            </Button>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">New request from John D.</p>
                  <p className="text-sm text-gray-600">2018 Honda Civic - Engine diagnostic</p>
                </div>
                <span className="text-sm text-gray-500">2 min ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Quote approved by Sarah M.</p>
                  <p className="text-sm text-gray-600">2020 Toyota Camry - Brake replacement</p>
                </div>
                <span className="text-sm text-gray-500">1 hour ago</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">Service completed for Mike R.</p>
                  <p className="text-sm text-gray-600">2019 Ford F-150 - Oil change</p>
                </div>
                <span className="text-sm text-gray-500">3 hours ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}