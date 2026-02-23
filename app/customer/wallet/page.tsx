"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Wallet, TrendingUp, Gift, Plus, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function WalletPage() {
  const [balance] = useState(350)
  const [cashback] = useState(150)

  const transactions = [
    { id: 1, type: "credit", amount: 100, reason: "First order bonus", date: "2 days ago", icon: Gift },
    { id: 2, type: "credit", amount: 50, reason: "Cashback on order #1234", date: "5 days ago", icon: TrendingUp },
    { id: 3, type: "debit", amount: 120, reason: "Used for order #1235", date: "1 week ago", icon: ArrowUpRight },
    { id: 4, type: "credit", amount: 100, reason: "Subscription bonus", date: "2 weeks ago", icon: Gift },
    { id: 5, type: "credit", amount: 220, reason: "Added via UPI", date: "3 weeks ago", icon: Plus },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-cream to-green-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon" className="hover:bg-green-50">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-farm-green">My Wallet</h1>
              <p className="text-sm text-muted-foreground">Manage your balance & cashback</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Wallet Balance Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-farm-green to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-6 h-6" />
                <span className="text-sm opacity-90">Total Balance</span>
              </div>
              <div className="text-4xl font-bold mb-1">₹{balance}</div>
              <div className="text-sm opacity-90">Available to use</div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white text-farm-green hover:bg-gray-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Money
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Money to Wallet</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Input type="number" placeholder="Enter amount" className="text-lg" />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 200, 500, 1000].map((amt) => (
                      <Button key={amt} variant="outline" className="h-12 bg-transparent">
                        ₹{amt}
                      </Button>
                    ))}
                  </div>
                  <Button className="w-full bg-farm-green hover:bg-farm-green/90">Continue to Payment</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Cashback Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Gift className="w-5 h-5" />
                <span className="text-sm opacity-90">Pending Cashback</span>
              </div>
              <div className="text-2xl font-bold">₹{cashback}</div>
              <div className="text-xs opacity-90">Will be added after delivery confirmation</div>
            </div>
            <TrendingUp className="w-12 h-12 opacity-50" />
          </div>
        </Card>

        {/* Offers */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Card className="p-4 border-2 border-green-200 bg-green-50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                ₹50
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">First Order Bonus</h3>
                <p className="text-sm text-muted-foreground">Get ₹50 cashback on your first order above ₹500</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-2 border-orange-200 bg-orange-50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                ₹100
              </div>
              <div className="flex-1">
                <h3 className="font-bold mb-1">Subscription Bonus</h3>
                <p className="text-sm text-muted-foreground">Start any subscription & get ₹100 wallet credit</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>
          <Card className="divide-y">
            {transactions.map((txn) => {
              const Icon = txn.icon
              return (
                <div key={txn.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === "credit" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{txn.reason}</div>
                    <div className="text-sm text-muted-foreground">{txn.date}</div>
                  </div>
                  <div className={`font-bold text-lg ${txn.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                  </div>
                </div>
              )
            })}
          </Card>
        </div>
      </div>
    </div>
  )
}
