"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ServiceCenterHeader } from "@/components/service-center-header"
import { useServiceCenterProfile } from "@/hooks/use-service-center-data"
import Link from "next/link"
import { ArrowLeft, MapPin, Phone, Mail, Globe, Clock, Award, Settings, Save, Plus, X } from "lucide-react"

export default function ServiceCenterProfilePage() {
  const { profile, updateProfile } = useServiceCenterProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [newSpecialty, setNewSpecialty] = useState("")
  const [newCertification, setNewCertification] = useState("")

  const handleSave = () => {
    updateProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setEditedProfile({
        ...editedProfile,
        specialties: [...editedProfile.specialties, newSpecialty.trim()],
      })
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index: number) => {
    setEditedProfile({
      ...editedProfile,
      specialties: editedProfile.specialties.filter((_, i) => i !== index),
    })
  }

  const addCertification = () => {
    if (newCertification.trim()) {
      setEditedProfile({
        ...editedProfile,
        certifications: [...editedProfile.certifications, newCertification.trim()],
      })
      setNewCertification("")
    }
  }

  const removeCertification = (index: number) => {
    setEditedProfile({
      ...editedProfile,
      certifications: editedProfile.certifications.filter((_, i) => i !== index),
    })
  }

  const updateOperatingHours = (day: string, field: "open" | "close", value: string) => {
    setEditedProfile({
      ...editedProfile,
      operatingHours: {
        ...editedProfile.operatingHours,
        [day]: {
          ...editedProfile.operatingHours[day],
          [field]: value,
        },
      },
    })
  }

  const toggleDayClosed = (day: string) => {
    const currentDay = editedProfile.operatingHours[day]
    setEditedProfile({
      ...editedProfile,
      operatingHours: {
        ...editedProfile.operatingHours,
        [day]: {
          ...currentDay,
          closed: !currentDay.closed,
        },
      },
    })
  }

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f4f1] to-white">
      {/* Header */}
      <ServiceCenterHeader title="Profile Settings" subtitle="Manage your business information and settings" />

      {/* Breadcrumb/Navigation */}
      <div className="pt-24 pb-4">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/service-center">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Profile Completeness */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Profile Completeness</div>
            <div className={`text-lg font-bold ${getCompletionColor(profile.profileCompleteness)}`}>
              {profile.profileCompleteness}%
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.businessName}
                    onChange={(e) => setEditedProfile({ ...editedProfile, businessName: e.target.value })}
                  />
                ) : (
                  <p className="text-gray-900">{profile.businessName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.phone}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.email}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.website || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, website: e.target.value })}
                    placeholder="www.example.com"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.website || "Not provided"}</span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <Input
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{profile.address}</span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                {isEditing ? (
                  <Textarea
                    value={editedProfile.description}
                    onChange={(e) => setEditedProfile({ ...editedProfile, description: e.target.value })}
                    rows={3}
                  />
                ) : (
                  <p className="text-gray-900">{profile.description}</p>
                )}
              </div>
            </div>
          </Card>

          {/* Specialties */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Specialties</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedProfile.specialties : profile.specialties).map((specialty, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800 flex items-center gap-1">
                    {specialty}
                    {isEditing && (
                      <button onClick={() => removeSpecialty(index)} className="ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Add new specialty"
                    onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
                  />
                  <Button onClick={addSpecialty} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Certifications */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {(isEditing ? editedProfile.certifications : profile.certifications).map((cert, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {cert}
                    {isEditing && (
                      <button onClick={() => removeCertification(index)} className="ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Add new certification"
                    onKeyPress={(e) => e.key === "Enter" && addCertification()}
                  />
                  <Button onClick={addCertification} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Operating Hours */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Operating Hours
            </h3>
            <div className="space-y-3">
              {Object.entries(isEditing ? editedProfile.operatingHours : profile.operatingHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-gray-900 capitalize w-24">{day}</div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!hours.closed}
                        onChange={() => toggleDayClosed(day)}
                        className="rounded"
                      />
                      {!hours.closed ? (
                        <>
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => updateOperatingHours(day, "open", e.target.value)}
                            className="w-32"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => updateOperatingHours(day, "close", e.target.value)}
                            className="w-32"
                          />
                        </>
                      ) : (
                        <span className="text-gray-500 italic">Closed</span>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-600">{hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
