"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  Video,
  FileText,
  IndianRupee,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ChefHat,
  Users,
} from "lucide-react"
import Link from "next/link"
import { RazorpayPaymentModal } from "@/components/razorpay-payment-modal"

export default function BulkOrderPage() {
  const [step, setStep] = useState<"form" | "payment" | "confirmation">("form")
  const [formData, setFormData] = useState({
    hallName: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    selectedProducts: [] as Array<{ id: string; quantity: string }>,
    address: "",
    phone: "",
    specialRequirements: "",
    butcherService: 0,
    cateringWorkers: 0,
  })

  const products = [
    { id: "goat", name: "Goat (Mutton)", minQty: 20, price: 750, unit: "kg" },
    { id: "sheep", name: "Sheep (Mutton)", minQty: 20, price: 680, unit: "kg" },
    { id: "chicken", name: "Desi Chicken", minQty: 30, price: 420, unit: "kg" },
  ]

  const meatAmount = formData.selectedProducts.reduce((total, item) => {
    const product = products.find(p => p.id === item.id);
    return total + (product ? Number.parseInt(item.quantity || "0") * product.price : 0);
  }, 0);
  const butcherAmount = formData.butcherService * 700
  const cateringAmount = formData.cateringWorkers * 300
  const totalAmount = meatAmount + butcherAmount + cateringAmount
  const advancePayment = totalAmount * 0.3 // 30% advance

  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleSubmit = () => {
    if (!formData.hallName || !formData.eventDate || formData.selectedProducts.length === 0) {
      alert("Please fill all required fields and select at least one product")
      return
    }
    setStep("payment")
  }

  const handlePayment = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("[v0] Bulk order payment successful:", paymentId)
    setShowPaymentModal(false)
    setStep("confirmation")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/90 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2 text-white">
                <ShoppingCart className="h-5 w-5" />
                Function Hall Bulk Order
              </h1>
              <p className="text-sm text-white/90">Fresh meat for weddings & events</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Order Form */}
        {step === "form" && (
          <div className="space-y-6">
            {/* Event Details */}
            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hallName">Function Hall / Event Name *</Label>
                    <Input
                      id="hallName"
                      placeholder="e.g., Grand Marriage Hall"
                      value={formData.hallName}
                      onChange={(e) => setFormData({ ...formData, hallName: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type</Label>
                    <Input
                      id="eventType"
                      placeholder="Wedding, Reception, Function"
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Event Date *</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guestCount">Expected Guests</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter complete address with landmarks"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  Product Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Products (Multiple Selection Allowed)</Label>
                  <div className="space-y-3">
                    {products.map((product) => {
                      const selectedItem = formData.selectedProducts.find(p => p.id === product.id);
                      const isSelected = !!selectedItem;
                      
                      return (
                        <Card
                          key={product.id}
                          className={`transition-all ${
                            isSelected
                              ? "border-2 border-secondary bg-secondary/5"
                              : "border hover:border-primary/50"
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex-1">
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-sm text-muted-foreground">₹{product.price}/kg</p>
                              </div>
                              <Button
                                size="sm"
                                variant={isSelected ? "default" : "outline"}
                                onClick={() => {
                                  if (isSelected) {
                                    setFormData({
                                      ...formData,
                                      selectedProducts: formData.selectedProducts.filter(p => p.id !== product.id)
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      selectedProducts: [...formData.selectedProducts, { id: product.id, quantity: "" }]
                                    });
                                  }
                                }}
                              >
                                {isSelected ? "Remove" : "Add"}
                              </Button>
                            </div>
                            {isSelected && (
                              <div className="space-y-2">
                                <Label htmlFor={`quantity-${product.id}`}>Quantity (kg)</Label>
                                <Input
                                  id={`quantity-${product.id}`}
                                  type="number"
                                  placeholder="Enter quantity in kg"
                                  value={selectedItem.quantity}
                                  onChange={(e) => {
                                    setFormData({
                                      ...formData,
                                      selectedProducts: formData.selectedProducts.map(p => 
                                        p.id === product.id ? { ...p, quantity: e.target.value } : p
                                      )
                                    });
                                  }}
                                />
                                {selectedItem.quantity && Number.parseInt(selectedItem.quantity) < product.minQty && (
                                  <p className="text-sm text-destructive">Minimum order quantity is {product.minQty} kg</p>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    placeholder="Any specific instructions (cutting style, packaging, delivery time, etc.)"
                    value={formData.specialRequirements}
                    onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Additional Services */}
            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-md">
                    <ChefHat className="h-5 w-5 text-white" />
                  </div>
                  Additional Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <ChefHat className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">Professional Butcher Service</p>
                          <p className="text-sm text-muted-foreground">Expert butcher for live cutting and meat preparation</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">₹700 each</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="butcherService" className="text-sm font-medium">Number of Butchers:</Label>
                      <Input
                        id="butcherService"
                        type="number"
                        min="0"
                        max="10"
                        placeholder="0"
                        value={formData.butcherService}
                        onChange={(e) => setFormData({ ...formData, butcherService: Number(e.target.value) || 0 })}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">Catering Workers</p>
                          <p className="text-sm text-muted-foreground">Skilled catering staff for food preparation and service</p>
                        </div>
                      </div>
                      <span className="font-bold text-primary">₹300 each</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Label htmlFor="cateringWorkers" className="text-sm font-medium">Number of Workers:</Label>
                      <Input
                        id="cateringWorkers"
                        type="number"
                        min="0"
                        max="20"
                        placeholder="0"
                        value={formData.cateringWorkers}
                        onChange={(e) => setFormData({ ...formData, cateringWorkers: Number(e.target.value) || 0 })}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            {totalAmount > 0 && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {formData.selectedProducts.map((item) => {
                      const product = products.find(p => p.id === item.id);
                      if (!product) return null;
                      const amount = Number.parseInt(item.quantity || "0") * product.price;
                      return (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="font-medium">{product.name} ({item.quantity}kg):</span>
                          <span className="font-semibold">₹{amount.toLocaleString()}</span>
                        </div>
                      );
                    })}
                    {formData.butcherService > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Butcher Service ({formData.butcherService}):</span>
                        <span className="font-semibold">₹{butcherAmount.toLocaleString()}</span>
                      </div>
                    )}
                    {formData.cateringWorkers > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Catering Workers ({formData.cateringWorkers}):</span>
                        <span className="font-semibold">₹{cateringAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-lg border-t pt-3">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="text-sm text-muted-foreground">Advance Payment (30%):</span>
                      <span className="font-semibold text-secondary">₹{advancePayment.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Balance on Delivery:</span>
                      <span className="font-semibold">₹{(totalAmount - advancePayment).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button onClick={handleSubmit} size="lg" className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all font-bold">
              Proceed to Payment
            </Button>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  Payment - Advance (30%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    {formData.selectedProducts.map((item) => {
                      const product = products.find(p => p.id === item.id);
                      if (!product) return null;
                      return (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{product.name}:</span>
                          <span className="font-medium">{item.quantity} kg</span>
                        </div>
                      );
                    })}
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Event Date:</span>
                      <span className="font-medium">{formData.eventDate}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Advance Payment:</span>
                      <span className="text-xl font-bold text-primary">₹{advancePayment.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Select Payment Method</Label>
                  <Button
                    variant="outline"
                    className="w-full justify-start h-auto p-4 bg-transparent"
                    onClick={handlePayment}
                  >
                    <div className="text-left">
                      <p className="font-semibold">UPI / Card / Net Banking</p>
                      <p className="text-xs text-muted-foreground">Secure payment via Razorpay</p>
                    </div>
                  </Button>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Escrow Protection:</strong> Your advance payment is held securely. Balance will be collected
                    on delivery. Full refund if order cancelled by us.&apos;
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button onClick={() => setStep("form")} variant="outline" className="flex-1 bg-transparent">
                    Back to Form
                  </Button>
                  <Button onClick={handlePayment} className="flex-1 bg-primary hover:bg-primary/90">
                    Pay &apos;₹&apos;{advancePayment.toLocaleString()}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Confirmation */}
        {step === "confirmation" && (
          <div className="space-y-6">
            <Card className="border-2 border-green-500/30">
              <CardContent className="p-8 text-center space-y-6">
                <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-2">Bulk Order Confirmed!</h2>
                  <p className="text-muted-foreground">Order ID: BULK-{Math.floor(Math.random() * 10000)}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Advance Paid:</span>
                    <span className="font-bold text-green-600">₹{advancePayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Balance on Delivery:</span>
                    <span className="font-semibold">₹{(totalAmount - advancePayment).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Event Date:</span>
                    <span className="font-medium">{formData.eventDate}</span>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-left">
                  <p className="text-sm font-medium text-blue-900 mb-2">What's Next?</p>
                  <ul className="text-xs text-blue-800 space-y-1">
                    <li>✓ Our team will call you within 2 hours to confirm details</li>
                    <li>✓ Farmer will be assigned 24 hours before event</li>
                    <li>✓ You'll receive live cutting video via SMS/WhatsApp</li>
                    <li>✓ Fresh delivery on event day as per scheduled time</li>
                    <li>✓ GST invoice will be sent via email after delivery</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Link href="/customer" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent">
                      Back to Shopping
                    </Button>
                  </Link>
                  <Button className="flex-1 bg-primary hover:bg-primary/90">Track Order</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Razorpay Payment Modal */}
      <RazorpayPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={advancePayment}
        orderDetails={{
          orderId: `BULK-${Math.floor(Math.random() * 10000)}`,
          description: `${formData.productType} - ${formData.quantity}kg (30% Advance)`,
          name: formData.hallName,
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
