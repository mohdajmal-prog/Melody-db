"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Milk, Beef, Carrot, Calendar, CheckCircle, Clock, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RazorpayPaymentModal } from "@/components/razorpay-payment-modal"

export default function ApartmentSubscriptionPage() {
  const [step, setStep] = useState<"form" | "confirmation">("form")
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([])
  const [userId, setUserId] = useState('')
  const [formData, setFormData] = useState({
    milkProduct: "",
    milkQuantity: "",
    milkDeliveryDays: [] as string[],
    meatProduct: "",
    meatQuantity: "",
    meatDeliveryDays: [] as string[],
    vegetableProduct: "",
    vegetableQuantity: "",
    vegetableDeliveryDays: [] as string[],
    startDate: "",
    deliveryTime: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem('melody_current_user')
    if (userData) {
      const user = JSON.parse(userData)
      setUserId(user.phone)
      fetchSubscriptions(user.phone)
    }
  }, [])

  const fetchSubscriptions = async (phone: string) => {
    try {
      const response = await fetch(`/api/subscriptions?userId=${phone}`)
      const data = await response.json()
      if (data.subscriptions && data.subscriptions.length > 0) {
        const formatted = data.subscriptions.map((sub: any) => ({
          id: sub._id,
          type: sub.type,
          quantity: sub.quantity,
          farmer: sub.farmer,
          price: sub.price,
          frequency: sub.frequency,
          status: sub.status,
          nextDelivery: sub.nextDelivery,
          savings: sub.savings
        }))
        setActiveSubscriptions(formatted)
      }
    } catch (error) {
      console.error('Failed to fetch subscriptions:', error)
    }
  }

  const products = {
    milk: [
      { name: "Cow Milk - 1L", price: 55 }
    ],
    meat: [
      { name: "Chicken - 1kg", price: 350 },
      { name: "Mutton - 1kg", price: 650 }
    ],
    vegetables: [
      { name: "Mixed Vegetables - 5kg", price: 200 },
      { name: "Leafy Greens - 2kg", price: 80 }
    ],
  }

  const calculateTotal = () => {
    let total = 0
    
    // Milk (based on selected days - 4 weeks a month)
    if (formData.milkProduct && formData.milkQuantity && formData.milkDeliveryDays.length > 0) {
      const milkPrice = products.milk.find(p => formData.milkProduct.includes(p.name.split(' - ')[0]))?.price || 0
      total += milkPrice * parseInt(formData.milkQuantity) * formData.milkDeliveryDays.length * 4
    }
    
    // Meat (weekly - 4 times a month)
    if (formData.meatProduct && formData.meatQuantity && formData.meatDeliveryDays.length > 0) {
      const meatPrice = products.meat.find(p => formData.meatProduct.includes(p.name.split(' - ')[0]))?.price || 0
      total += meatPrice * parseInt(formData.meatQuantity) * formData.meatDeliveryDays.length * 4
    }
    
    // Vegetables (weekly - 4 times a month)
    if (formData.vegetableProduct && formData.vegetableQuantity && formData.vegetableDeliveryDays.length > 0) {
      const vegPrice = products.vegetables.find(p => formData.vegetableProduct.includes(p.name.split(' - ')[0]))?.price || 0
      total += vegPrice * parseInt(formData.vegetableQuantity) * formData.vegetableDeliveryDays.length * 4
    }
    
    return total
  }

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  const handleSubscribe = () => {
    setShowPaymentModal(true)
  }

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("Subscription payment successful:", paymentId)
    setShowPaymentModal(false)
    setStep("confirmation")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Apartment Subscription</h1>
              <p className="text-sm text-white/90">All-in-one subscription for daily essentials</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {activeSubscriptions.length > 0 && (
          <Card className="mb-6 border-2 border-green-200 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-transparent border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white" />
                </div>
                Active Subscriptions ({activeSubscriptions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {activeSubscriptions.map((sub) => (
                <Card key={sub.id} className="border-2 border-green-100 hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-green-700">{sub.type}</h3>
                        <p className="text-sm text-muted-foreground">{sub.farmer}</p>
                      </div>
                      <Badge className={sub.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0' : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0'}>
                        {sub.status === 'active' ? '✓ Active' : '⏸ Paused'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-semibold ml-2">{sub.quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Frequency:</span>
                        <span className="font-semibold ml-2">{sub.frequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Next Delivery:</span>
                        <span className="font-semibold ml-2 text-green-600">{sub.nextDelivery}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-bold ml-2">₹{sub.price}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Link href="/customer/subscriptions">
                <Button variant="outline" className="w-full border-2 hover:bg-green-50">
                  Manage All Subscriptions →
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {step === "form" && (
          <>
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 via-white to-green-100">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-green-600" />
                  Complete Subscription Package
                </CardTitle>
                <p className="text-sm text-muted-foreground">Select products and delivery schedule</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Milk Section */}
                <div className="space-y-3 p-4 bg-white rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Milk className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-lg">Milk (Weekly Delivery)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-semibold">Select Product</Label>
                      <Select value={formData.milkProduct} onValueChange={(val) => setFormData({...formData, milkProduct: val})}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Choose milk type" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.milk.map((product, idx) => (
                            <SelectItem key={idx} value={`${product.name} (₹${product.price})`}>{product.name} (₹{product.price})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Quantity (Liters)</Label>
                      <Input type="number" min="1" placeholder="e.g., 2" className="bg-white" value={formData.milkQuantity} onChange={(e) => setFormData({...formData, milkQuantity: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Delivery Days</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weekDays.map((day) => (
                        <div key={day} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                          <Checkbox 
                            id={`milk-${day}`}
                            checked={formData.milkDeliveryDays.includes(day)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({...formData, milkDeliveryDays: [...formData.milkDeliveryDays, day]})
                              } else {
                                setFormData({...formData, milkDeliveryDays: formData.milkDeliveryDays.filter(d => d !== day)})
                              }
                            }}
                          />
                          <Label htmlFor={`milk-${day}`} className="text-sm cursor-pointer">{day.slice(0, 3)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meat Section */}
                <div className="space-y-3 p-4 bg-white rounded-lg border-2 border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Beef className="h-5 w-5 text-orange-600" />
                    <h3 className="font-bold text-lg">Meat (Weekly Delivery)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-semibold">Select Product</Label>
                      <Select value={formData.meatProduct} onValueChange={(val) => setFormData({...formData, meatProduct: val})}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Choose meat type" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.meat.map((product, idx) => (
                            <SelectItem key={idx} value={`${product.name} (₹${product.price})`}>{product.name} (₹{product.price})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Quantity (Kg)</Label>
                      <Input type="number" min="1" placeholder="e.g., 2" className="bg-white" value={formData.meatQuantity} onChange={(e) => setFormData({...formData, meatQuantity: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Delivery Days</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weekDays.map((day) => (
                        <div key={day} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                          <Checkbox 
                            id={`meat-${day}`}
                            checked={formData.meatDeliveryDays.includes(day)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({...formData, meatDeliveryDays: [...formData.meatDeliveryDays, day]})
                              } else {
                                setFormData({...formData, meatDeliveryDays: formData.meatDeliveryDays.filter(d => d !== day)})
                              }
                            }}
                          />
                          <Label htmlFor={`meat-${day}`} className="text-sm cursor-pointer">{day.slice(0, 3)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Vegetables Section */}
                <div className="space-y-3 p-4 bg-white rounded-lg border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Carrot className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-lg">Vegetables (Weekly Delivery)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-semibold">Select Product</Label>
                      <Select value={formData.vegetableProduct} onValueChange={(val) => setFormData({...formData, vegetableProduct: val})}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Choose vegetable pack" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.vegetables.map((product, idx) => (
                            <SelectItem key={idx} value={`${product.name} (₹${product.price})`}>{product.name} (₹{product.price})</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Quantity (Kg)</Label>
                      <Input type="number" min="1" placeholder="e.g., 5" className="bg-white" value={formData.vegetableQuantity} onChange={(e) => setFormData({...formData, vegetableQuantity: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Delivery Days</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {weekDays.map((day) => (
                        <div key={day} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                          <Checkbox 
                            id={`veg-${day}`}
                            checked={formData.vegetableDeliveryDays.includes(day)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData({...formData, vegetableDeliveryDays: [...formData.vegetableDeliveryDays, day]})
                              } else {
                                setFormData({...formData, vegetableDeliveryDays: formData.vegetableDeliveryDays.filter(d => d !== day)})
                              }
                            }}
                          />
                          <Label htmlFor={`veg-${day}`} className="text-sm cursor-pointer">{day.slice(0, 3)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery Schedule */}
                <div className="space-y-4 p-4 bg-white rounded-lg border-2 border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <h3 className="font-bold text-lg">Delivery Schedule</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-semibold">Start Date</Label>
                      <Input type="date" className="bg-white" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold">Delivery Time</Label>
                      <Select value={formData.deliveryTime} onValueChange={(val) => setFormData({...formData, deliveryTime: val})}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6am-8am">6:00 AM - 8:00 AM</SelectItem>
                          <SelectItem value="8am-10am">8:00 AM - 10:00 AM</SelectItem>
                          <SelectItem value="5pm-7pm">5:00 PM - 7:00 PM</SelectItem>
                          <SelectItem value="7pm-9pm">7:00 PM - 9:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button className="w-full shadow-lg hover:shadow-xl" size="lg" onClick={handleSubscribe}>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Subscribe Now - ₹{calculateTotal()}/month
                </Button>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="mt-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-2 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Subscription Benefits
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Never run out of daily essentials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Flexible delivery schedule</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Pause or cancel anytime</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Fresh products directly from farmers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </>
        )}

        {step === "confirmation" && (
          <Card className="border-2 border-green-500/30">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-2">Subscription Activated!</h2>
                <p className="text-muted-foreground">Subscription ID: SUB-{Math.floor(Math.random() * 10000)}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Start Date:</span>
                  <span className="font-bold">{formData.startDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Delivery Time:</span>
                  <span className="font-semibold">{formData.deliveryTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Milk Delivery:</span>
                  <span className="font-semibold">{formData.milkDeliveryDays.join(", ") || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Meat Delivery:</span>
                  <span className="font-semibold">{formData.meatDeliveryDays.join(", ") || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Vegetable Delivery:</span>
                  <span className="font-semibold">{formData.vegetableDeliveryDays.join(", ") || "Not selected"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-left">
                <p className="text-sm font-medium text-blue-900 mb-2">What's Next?</p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>✓ First delivery will start from selected date</li>
                  <li>✓ You'll receive SMS/WhatsApp before each delivery</li>
                  <li>✓ Pause or modify subscription anytime</li>
                  <li>✓ Fresh products directly from verified farmers</li>
                </ul>
              </div>

              <Link href="/customer">
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Razorpay Payment Modal */}
      <RazorpayPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={calculateTotal()}
        orderDetails={{
          orderId: `SUB-${Math.floor(Math.random() * 10000)}`,
          description: "Complete Apartment Subscription (Monthly)",
          name: "Apartment Subscription",
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
