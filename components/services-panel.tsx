"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  X,
  Users,
  Wrench,
  Droplets,
  Zap,
  Hammer,
  Calendar,
  ChefHat,
  Stethoscope,
  Phone,
  MapPin,
  Clock,
  Star,
} from "lucide-react"

interface ServicesPanelProps {
  isOpen: boolean
  onClose: () => void
}

const services = [
  {
    id: "function-hall-workers",
    name: "Function Hall Workers",
    icon: Users,
    description: "Skilled staff for event setup, serving, and cleanup",
    price: "₹800/day",
    category: "Event Services",
    rating: 4.8,
    available: true,
  },
  {
    id: "mechanic",
    name: "Mechanic Workers",
    icon: Wrench,
    description: "Professional mechanics for vehicle repairs and maintenance",
    price: "₹500/visit",
    category: "Technical Services",
    rating: 4.6,
    available: true,
  },
  {
    id: "plumbers",
    name: "Plumbers",
    icon: Droplets,
    description: "Expert plumbing services for installation and repairs",
    price: "₹400/visit",
    category: "Technical Services",
    rating: 4.7,
    available: true,
  },
  {
    id: "electrician",
    name: "Electrician",
    icon: Zap,
    description: "Certified electricians for electrical work and repairs",
    price: "₹450/visit",
    category: "Technical Services",
    rating: 4.9,
    available: true,
  },
  {
    id: "construction",
    name: "Construction Workers",
    icon: Hammer,
    description: "Skilled construction workers for building and renovation",
    price: "₹600/day",
    category: "Construction",
    rating: 4.5,
    available: true,
  },
  {
    id: "function-hall-events",
    name: "Function Hall Events",
    icon: Calendar,
    description: "Complete event management for weddings and functions",
    price: "₹2,500/event",
    category: "Event Services",
    rating: 4.8,
    available: true,
  },
  {
    id: "butcher",
    name: "Professional Butcher",
    icon: ChefHat,
    description: "Expert butchers for meat preparation and cutting",
    price: "₹1,200/service",
    category: "Food Services",
    rating: 4.7,
    available: true,
  },
  {
    id: "veterinary",
    name: "Veterinary Services",
    icon: Stethoscope,
    description: "Animal healthcare and veterinary consultations",
    price: "₹300/visit",
    category: "Healthcare",
    rating: 4.6,
    available: true,
  },
]

const categories = [
  "All Services",
  "Event Services",
  "Technical Services",
  "Construction",
  "Food Services",
  "Healthcare",
]

export function ServicesPanel({ isOpen, onClose }: ServicesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState("All Services")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    address: "",
    date: "",
    time: "",
    requirements: "",
    quantity: 1,
  })

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === "All Services" || service.category === selectedCategory
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleBooking = () => {
    // Handle booking logic here
    alert("Booking request submitted! Our team will contact you shortly.")
    setSelectedService(null)
    setBookingForm({
      name: "",
      phone: "",
      address: "",
      date: "",
      time: "",
      requirements: "",
      quantity: 1,
    })
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <h2 className="text-xl font-bold">Services</h2>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close services">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {!selectedService ? (
              <>
                {/* Search */}
                <div className="p-4 border-b">
                  <Input
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>

                {/* Categories */}
                <div className="p-4 border-b">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className="flex-shrink-0"
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Services List */}
                <div className="p-4 space-y-4 pb-8">
                  {filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedService(service.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <service.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-semibold">{service.name}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {service.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-primary text-primary" />
                                {service.rating}
                              </div>
                              <span>•</span>
                              <span className={`flex items-center gap-1 ${service.available ? 'text-green-600' : 'text-red-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${service.available ? 'bg-green-600' : 'bg-red-600'}`} />
                                {service.available ? 'Available' : 'Unavailable'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              /* Booking Form */
              <div className="p-4 space-y-4">
                {(() => {
                  const service = services.find(s => s.id === selectedService)
                  if (!service) return null

                  return (
                    <>
                      <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg">
                        <service.icon className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-muted-foreground">{service.price}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              placeholder="Your name"
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+91 9876543210"
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address *</Label>
                          <Textarea
                            id="address"
                            placeholder="Complete address with landmarks"
                            value={bookingForm.address}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                              id="date"
                              type="date"
                              value={bookingForm.date}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Time *</Label>
                            <Input
                              id="time"
                              type="time"
                              value={bookingForm.time}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                            />
                          </div>
                        </div>

                        {service.category === "Event Services" || service.category === "Construction" ? (
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Number of Workers *</Label>
                            <Input
                              id="quantity"
                              type="number"
                              min="1"
                              max="20"
                              value={bookingForm.quantity}
                              onChange={(e) => setBookingForm(prev => ({ ...prev, quantity: Number(e.target.value) || 1 }))}
                            />
                          </div>
                        ) : null}

                        <div className="space-y-2">
                          <Label htmlFor="requirements">Special Requirements</Label>
                          <Textarea
                            id="requirements"
                            placeholder="Any specific instructions or requirements..."
                            value={bookingForm.requirements}
                            onChange={(e) => setBookingForm(prev => ({ ...prev, requirements: e.target.value }))}
                            rows={3}
                          />
                        </div>

                        <div className="pt-4 space-y-3">
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span>Service:</span>
                              <span className="font-medium">{service.name}</span>
                            </div>
                            {bookingForm.quantity > 1 && (
                              <div className="flex justify-between text-sm mt-1">
                                <span>Quantity:</span>
                                <span className="font-medium">{bookingForm.quantity}</span>
                              </div>
                            )}
                            <div className="flex justify-between text-sm mt-1 font-semibold border-t pt-2">
                              <span>Total:</span>
                              <span>₹{(parseInt(service.price.replace(/[^\d]/g, '')) * bookingForm.quantity).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button variant="outline" onClick={() => setSelectedService(null)} className="flex-1">
                              Back
                            </Button>
                            <Button onClick={handleBooking} className="flex-1">
                              Book Service
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
