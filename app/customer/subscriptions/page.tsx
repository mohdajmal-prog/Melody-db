"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Package, Play, Pause, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SubscriptionsPage() {
  const [modifyDialogOpen, setModifyDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null)
  const [modifiedQuantity, setModifiedQuantity] = useState('')
  const [modifiedDeliveryTime, setModifiedDeliveryTime] = useState('')
  
  const [newSubscription, setNewSubscription] = useState({
    type: '',
    quantity: '',
    deliveryTime: ''
  })

  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([])
  const [userId, setUserId] = useState('')

  // Load user and subscriptions from database
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

  // Save subscriptions to database
  const updateSubscriptions = async (newSubs: any[]) => {
    setActiveSubscriptions(newSubs)
  }

  const [pausedSubscriptions] = useState([
    {
      id: 3,
      type: "Monthly Eggs",
      quantity: "30 Eggs",
      farmer: "Lakshmi Poultry - Shamshabad",
      price: 180,
      frequency: "1st of every month",
      status: "paused",
      pausedUntil: "Jan 15, 2026",
    },
  ])

  const pauseSubscription = async (id: string) => {
    try {
      await fetch('/api/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'paused' })
      })
      const updated = activeSubscriptions.map(sub =>
        sub.id === id ? { ...sub, status: 'paused' } : sub
      )
      updateSubscriptions(updated)
    } catch (error) {
      console.error('Failed to pause subscription:', error)
    }
  }

  const resumeSubscription = async (id: string) => {
    try {
      await fetch('/api/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'active' })
      })
      const updated = activeSubscriptions.map(sub =>
        sub.id === id ? { ...sub, status: 'active' } : sub
      )
      updateSubscriptions(updated)
    } catch (error) {
      console.error('Failed to resume subscription:', error)
    }
  }

  const modifySubscription = (subscription: any) => {
    setSelectedSubscription(subscription)
    setModifiedQuantity(subscription.quantity)
    setModifiedDeliveryTime('6am') // default value
    setModifyDialogOpen(true)
  }

  const saveSubscriptionChanges = async () => {
    if (selectedSubscription) {
      try {
        await fetch('/api/subscriptions', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            id: selectedSubscription.id, 
            quantity: modifiedQuantity, 
            frequency: modifiedDeliveryTime === '6am' ? 'Daily at 6:00 AM' : modifiedDeliveryTime === '7am' ? 'Daily at 7:00 AM' : modifiedDeliveryTime === '8am' ? 'Daily at 8:00 AM' : 'Daily at 6:00 PM'
          })
        })
        const updated = activeSubscriptions.map(sub =>
          sub.id === selectedSubscription.id
            ? { ...sub, quantity: modifiedQuantity, frequency: modifiedDeliveryTime === '6am' ? 'Daily at 6:00 AM' : modifiedDeliveryTime === '7am' ? 'Daily at 7:00 AM' : modifiedDeliveryTime === '8am' ? 'Daily at 8:00 AM' : 'Daily at 6:00 PM' }
            : sub
        )
        updateSubscriptions(updated)
        alert('Subscription updated successfully!')
        setModifyDialogOpen(false)
        setSelectedSubscription(null)
        setModifiedQuantity('')
        setModifiedDeliveryTime('')
      } catch (error) {
        console.error('Failed to update subscription:', error)
        alert('Failed to update subscription')
      }
    }
  }

  const createNewSubscription = async () => {
    if (!newSubscription.type || !newSubscription.quantity || !newSubscription.deliveryTime) {
      alert('Please fill all fields')
      return
    }

    const typeMap: any = {
      milk: { name: 'Daily Milk', farmer: 'Rama Krishna - Kollur', price: 120, frequency: 'Daily', savings: 180 },
      veg: { name: 'Weekly Vegetables', farmer: 'Venkat Farms - Chevella', price: 350, frequency: 'Every Sunday', savings: 100 },
      eggs: { name: 'Monthly Eggs', farmer: 'Lakshmi Poultry - Shamshabad', price: 180, frequency: '1st of every month', savings: 50 },
      chicken: { name: 'Weekly Desi Chicken', farmer: 'Krishna Farms - Shadnagar', price: 450, frequency: 'Every Saturday', savings: 120 }
    }

    const timeMap: any = {
      '6am': 'Daily at 6:00 AM',
      '7am': 'Daily at 7:00 AM',
      '8am': 'Daily at 8:00 AM',
      'evening': 'Daily at 6:00 PM'
    }

    const template = typeMap[newSubscription.type]
    const newSub = {
      userId,
      type: template.name,
      quantity: newSubscription.quantity,
      farmer: template.farmer,
      price: template.price,
      frequency: timeMap[newSubscription.deliveryTime] || template.frequency,
      status: 'active',
      nextDelivery: 'Tomorrow',
      savings: template.savings
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSub)
      })
      const data = await response.json()
      if (data.success) {
        updateSubscriptions([...activeSubscriptions, data.subscription])
        alert('Subscription created successfully! You saved 15%')
        setCreateDialogOpen(false)
        setNewSubscription({ type: '', quantity: '', deliveryTime: '' })
      }
    } catch (error) {
      console.error('Failed to create subscription:', error)
      alert('Failed to create subscription')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-blue-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/98 backdrop-blur-md border-b border-green-100 shadow-md">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/customer">
                <Button variant="ghost" size="icon" className="hover:bg-green-50 hover:scale-105 transition-transform">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">My Subscriptions</h1>
                <p className="text-sm text-muted-foreground mt-0.5">Save time & money with regular deliveries</p>
              </div>
            </div>

            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  New Subscription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Subscription</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>Subscription Type</Label>
                    <Select value={newSubscription.type} onValueChange={(value) => setNewSubscription({...newSubscription, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="milk">Daily Milk</SelectItem>
                        <SelectItem value="veg">Weekly Vegetables</SelectItem>
                        <SelectItem value="eggs">Monthly Eggs</SelectItem>
                        <SelectItem value="chicken">Weekly Desi Chicken</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input 
                      placeholder="e.g., 2 Liters, 5 kg" 
                      value={newSubscription.quantity}
                      onChange={(e) => setNewSubscription({...newSubscription, quantity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Delivery Time</Label>
                    <Select value={newSubscription.deliveryTime} onValueChange={(value) => setNewSubscription({...newSubscription, deliveryTime: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6am">6:00 AM</SelectItem>
                        <SelectItem value="7am">7:00 AM</SelectItem>
                        <SelectItem value="8am">8:00 AM</SelectItem>
                        <SelectItem value="evening">6:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    onClick={createNewSubscription}
                  >
                    Start Subscription - Save 15%
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Benefits Banner */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white shadow-2xl border-0">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Subscription Benefits</h2>
              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="font-bold text-lg mb-1">Save 15-20%</div>
                  <div className="opacity-90">Lower prices than regular orders</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="font-bold text-lg mb-1">₹100 Wallet Bonus</div>
                  <div className="opacity-90">On your first subscription</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="font-bold text-lg mb-1">Pause Anytime</div>
                  <div className="opacity-90">Flexible schedule control</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Active Subscriptions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            Active Subscriptions ({activeSubscriptions.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {activeSubscriptions.map((sub) => (
              <Card key={sub.id} className="p-6 hover:shadow-2xl transition-all duration-300 border-2 border-green-100 hover:border-green-300 bg-gradient-to-br from-white to-green-50/30">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-bold text-xl text-green-700">{sub.type}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{sub.farmer}</p>
                  </div>
                  <Badge className={sub.status === 'active' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1' : 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 px-3 py-1'}>
                    {sub.status === 'active' ? '✓ Active' : '⏸ Paused'}
                  </Badge>
                </div>

                <div className="space-y-3 mb-5 bg-white/60 rounded-xl p-4 border border-green-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span className="font-semibold">{sub.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frequency:</span>
                    <span className="font-semibold">{sub.frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Next Delivery:</span>
                    <span className="font-semibold text-farm-green">{sub.nextDelivery}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground text-sm">Price:</span>
                    <div className="text-right">
                      <div className="font-bold text-lg">₹{sub.price}</div>
                      <div className="text-xs text-green-600">Saving ₹{sub.savings}/month</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  {sub.status === 'active' ? (
                    <Button variant="outline" className="flex-1 border-2 hover:bg-orange-50 hover:border-orange-300" onClick={() => pauseSubscription(sub.id)}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" onClick={() => resumeSubscription(sub.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline" className="flex-1 border-2 hover:bg-blue-50 hover:border-blue-300" onClick={() => modifySubscription(sub)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Modify
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Paused Subscriptions */}
        {pausedSubscriptions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                <Pause className="w-5 h-5 text-white" />
              </div>
              Paused Subscriptions ({pausedSubscriptions.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              {pausedSubscriptions.map((sub) => (
                <Card key={sub.id} className="p-6 bg-gradient-to-br from-gray-50 to-orange-50/30 border-2 border-orange-100 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{sub.type}</h3>
                      <p className="text-sm text-muted-foreground">{sub.farmer}</p>
                    </div>
                    <Badge variant="secondary">Paused</Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Paused Until:</span>
                      <span className="font-semibold">{sub.pausedUntil}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-sm">Price:</span>
                      <span className="font-bold text-lg">₹{sub.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-farm-green hover:bg-farm-green/90"
                      onClick={() => resumeSubscription(sub.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                    <Button variant="outline" className="text-red-600 bg-transparent">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Modify Subscription Dialog */}
        <Dialog open={modifyDialogOpen} onOpenChange={setModifyDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modify Subscription</DialogTitle>
            </DialogHeader>
            {selectedSubscription && (
              <div className="space-y-4 pt-4">
                <div>
                  <Label className="text-sm font-medium">Subscription Type</Label>
                  <p className="text-sm text-muted-foreground">{selectedSubscription.type}</p>
                </div>
                <div>
                  <Label>Update Quantity</Label>
                  <Input
                    value={modifiedQuantity}
                    onChange={(e) => setModifiedQuantity(e.target.value)}
                    placeholder="e.g., 2 Liters, 5 kg"
                  />
                </div>
                <div>
                  <Label>Update Delivery Time</Label>
                  <Select value={modifiedDeliveryTime} onValueChange={setModifiedDeliveryTime}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6am">6:00 AM</SelectItem>
                      <SelectItem value="7am">7:00 AM</SelectItem>
                      <SelectItem value="8am">8:00 AM</SelectItem>
                      <SelectItem value="evening">6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 text-gray-700"
                    onClick={() => setModifyDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={saveSubscriptionChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
