"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TruckIcon,
  MapPin,
  Navigation,
  CheckCircle2,
  Camera,
  Phone,
  ArrowLeft,
  IndianRupee,
  Clock,
  Package,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function DriverPage() {
  const [activeTab, setActiveTab] = useState<
    "available" | "active" | "completed"
  >("available");

  const driverProfile = {
    name: "Ramesh Kumar",
    vehicle: "Tata Ace",
    vehicleNumber: "TS 09 AB 1234",
    rating: 4.7,
    todayEarnings: 1250,
    todayDeliveries: 8,
    verified: true,
  };

  const availableDeliveries = [
    {
      id: "DEL-4501",
      farmer: "Raju Goats, Chevella",
      customer: "Rahul K., Gachibowli",
      product: "Goat - 24-26kg",
      distance: "18 km",
      amount: 450,
      pickupTime: "11:00 AM",
      deliveryTime: "12:30 PM",
      priority: "normal",
    },
    {
      id: "DEL-4502",
      farmer: "Krishna Dairy, Moinabad",
      customer: "Function Hall, Kondapur",
      product: "Bulk Order - 4 Goats",
      distance: "25 km",
      amount: 850,
      pickupTime: "10:30 AM",
      deliveryTime: "01:00 PM",
      priority: "high",
    },
  ];

  const activeDelivery = {
    id: "DEL-4498",
    farmer: "Lakshmi Farms, Shankarpally",
    farmerPhone: "+91 98765 43210",
    customer: "Priya M., Madhapur",
    customerPhone: "+91 98765 12345",
    product: "Desi Chicken - 1.2-1.8kg",
    amount: 350,
    status: "picked_up",
    progress: 65,
    eta: "15 mins",
    currentLocation: "Near Wipro Circle",
    deliveryAddress:
      "Flat 402, Rainbow Apartments, Madhapur, Hyderabad - 500081",
  };

  const completedDeliveries = [
    {
      id: "DEL-4495",
      customer: "Arun S.",
      product: "Sheep - 21-23kg",
      amount: 380,
      time: "09:45 AM",
      rating: 5,
    },
    {
      id: "DEL-4492",
      customer: "Sneha P.",
      product: "Fresh Milk - 5L",
      amount: 150,
      time: "08:30 AM",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <TruckIcon className="h-5 w-5 text-accent" />
                  Driver Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  {driverProfile.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {driverProfile.verified && (
                <Badge className="bg-accent text-accent-foreground">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Link href="/driver/kyc">
                <Button variant="ghost" size="sm">
                  KYC Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Today's Earnings
                  </p>
                  <p className="text-2xl font-bold text-foreground flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {driverProfile.todayEarnings}
                  </p>
                </div>
                <IndianRupee className="h-10 w-10 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Deliveries Today
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {driverProfile.todayDeliveries}
                  </p>
                </div>
                <Package className="h-10 w-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Rating</p>
                  <p className="text-2xl font-bold text-green-700">
                    {driverProfile.rating}/5.0
                  </p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle Info */}
        <Card className="mb-6 border-l-4 border-l-accent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TruckIcon className="h-8 w-8 text-accent" />
                <div>
                  <p className="font-bold">{driverProfile.vehicle}</p>
                  <p className="text-sm text-muted-foreground">
                    {driverProfile.vehicleNumber}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-700 border-green-500/20"
              >
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={activeTab === "available" ? "default" : "outline"}
            onClick={() => setActiveTab("available")}
            className="flex-shrink-0 bg-transparent"
          >
            Available ({availableDeliveries.length})
          </Button>
          <Button
            variant={activeTab === "active" ? "default" : "outline"}
            onClick={() => setActiveTab("active")}
            className="flex-shrink-0 bg-transparent"
          >
            Active (1)
          </Button>
          <Button
            variant={activeTab === "completed" ? "default" : "outline"}
            onClick={() => setActiveTab("completed")}
            className="flex-shrink-0 bg-transparent"
          >
            Completed ({completedDeliveries.length})
          </Button>
        </div>

        {/* Available Deliveries */}
        {activeTab === "available" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">New Delivery Requests</h2>
            {availableDeliveries.map((delivery) => (
              <Card
                key={delivery.id}
                className="overflow-hidden border-l-4 border-l-primary"
              >
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{delivery.id}</CardTitle>
                    {delivery.priority === "high" && (
                      <Badge className="bg-red-500/10 text-red-700 border-red-500/20">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        High Priority
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Pickup</p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.farmer}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {delivery.pickupTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Navigation className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {delivery.customer}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {delivery.deliveryTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{delivery.product}</p>
                      <p className="text-xs text-muted-foreground">
                        Distance: {delivery.distance}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary">
                      ₹{delivery.amount}
                    </p>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setActiveTab("active")}
                  >
                    Accept Delivery
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Active Delivery */}
        {activeTab === "active" && (
          <div className="space-y-4">
            <Card className="border-2 border-primary">
              <CardHeader className="bg-primary/5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{activeDelivery.id}</CardTitle>
                  <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                    In Transit
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Delivery Progress</span>
                    <span className="text-muted-foreground">
                      ETA: {activeDelivery.eta}
                    </span>
                  </div>
                  <Progress value={activeDelivery.progress} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    Current: {activeDelivery.currentLocation}
                  </p>
                </div>

                {/* Product Info */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="font-semibold mb-1">{activeDelivery.product}</p>
                  <p className="text-sm text-muted-foreground">
                    Amount: ₹{activeDelivery.amount}
                  </p>
                </div>

                {/* Pickup Info */}
                <div className="space-y-3 pb-3 border-b">
                  <p className="text-sm font-semibold text-muted-foreground">
                    PICKED UP FROM
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{activeDelivery.farmer}</p>
                      <p className="text-sm text-muted-foreground">
                        {activeDelivery.farmerPhone}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 bg-transparent"
                    >
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">
                    DELIVERING TO
                  </p>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{activeDelivery.customer}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 bg-transparent"
                      >
                        <Phone className="h-4 w-4" />
                        Call
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activeDelivery.deliveryAddress}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-4">
                  <Button className="w-full gap-2" size="lg">
                    <Navigation className="h-5 w-5" />
                    Navigate to Customer
                  </Button>
                  <Button
                    className="w-full gap-2 bg-secondary hover:bg-secondary/90"
                    size="lg"
                  >
                    <Camera className="h-5 w-5" />
                    Upload Delivery Photo
                  </Button>
                  <Button
                    className="w-full gap-2 bg-transparent"
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      alert("Order marked as delivered!");
                      setActiveTab("completed");
                    }}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    Mark as Delivered
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* GPS Warning */}
            <Card className="bg-yellow-500/5 border-yellow-500/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">GPS Tracking Active</p>
                    <p className="text-xs text-muted-foreground">
                      Your location is being shared with customer for
                      transparency
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Completed Deliveries */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Today's Completed Deliveries</h2>
            {completedDeliveries.map((delivery) => (
              <Card key={delivery.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold">{delivery.id}</p>
                        <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Delivered
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Customer: {delivery.customer}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        {delivery.product}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {delivery.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary mb-2">
                        ₹{delivery.amount}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(delivery.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-500">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
