"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Package,
  Plus,
  Minus,
  Milk,
  Carrot,
  ChefHat,
  ShoppingCart,
  TruckIcon,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface PlanItem {
  id: string;
  name: string;
  icon: string;
  basePrice: number;
  unit: string;
  quantity: number;
  selected: boolean;
}

export default function CreateSubscriptionPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [planDuration, setPlanDuration] = useState<string>("monthly");
  const [items, setItems] = useState<PlanItem[]>([
    {
      id: "milk",
      name: "Fresh Milk",
      icon: "Milk",
      basePrice: 65,
      unit: "liter",
      quantity: 2,
      selected: true,
    },
    {
      id: "vegetables",
      name: "Mixed Vegetables",
      icon: "Carrot",
      basePrice: 45,
      unit: "kg",
      quantity: 1,
      selected: true,
    },
    {
      id: "eggs",
      name: "Farm Fresh Eggs",
      icon: "ChefHat",
      basePrice: 7,
      unit: "eggs",
      quantity: 6,
      selected: true,
    },
    {
      id: "ghee",
      name: "Pure Ghee",
      icon: "Package",
      basePrice: 850,
      unit: "kg",
      quantity: 0.5,
      selected: false,
    },
    {
      id: "paneer",
      name: "Fresh Paneer",
      icon: "Package",
      basePrice: 320,
      unit: "kg",
      quantity: 0.25,
      selected: false,
    },
  ]);

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    );
  };

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const selectedItems = items.filter(item => item.selected);
  const totalMonthly = selectedItems.reduce((sum, item) => {
    const daysInMonth = 30; // Approximate
    return sum + (item.basePrice * item.quantity * daysInMonth);
  }, 0);

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case "Milk":
        return <Milk className="h-5 w-5" />;
      case "Carrot":
        return <Carrot className="h-5 w-5" />;
      case "ChefHat":
        return <ChefHat className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const handleCreatePlan = () => {
    // In a real app, this would create the subscription via API
    alert("Monthly Fresh Plan created successfully! You will be redirected to manage your plans.");
    // Redirect to subscriptions page
    window.location.href = "/customer/subscriptions";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer/subscriptions">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Create Monthly Fresh Plan</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Customize Your Plan</h2>
          <p className="text-muted-foreground">
            Select items, quantities, and delivery preferences for your monthly subscription.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Select Items & Quantities
                </CardTitle>
                <CardDescription>
                  Choose your daily essentials and set quantities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id={item.id}
                        checked={item.selected}
                        onCheckedChange={() => toggleItem(item.id)}
                      />
                      <div className="flex items-center gap-3">
                        {getItemIcon(item.icon)}
                        <div>
                          <Label htmlFor={item.id} className="font-medium cursor-pointer">
                            {item.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            ₹{item.basePrice}/{item.unit}
                          </p>
                        </div>
                      </div>
                    </div>

                    {item.selected && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity - (item.unit === "eggs" ? 6 : 0.5))}
                          disabled={item.quantity <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-16 text-center font-medium">
                          {item.quantity} {item.unit}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity + (item.unit === "eggs" ? 6 : 0.5))}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TruckIcon className="h-5 w-5" />
                  Delivery Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Plan Duration</Label>
                    <Select value={planDuration} onValueChange={setPlanDuration}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="annual">Annual (Save 10%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Deliveries will be scheduled daily. You can pause or modify your plan anytime from the My Plans section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Plan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Items */}
                <div>
                  <h4 className="font-medium mb-3">Daily Items</h4>
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          {getItemIcon(item.icon)}
                          {item.name}
                        </span>
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span className="capitalize">{planDuration}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between">
                      <span>Start Date</span>
                      <span>{format(selectedDate, "MMM dd, yyyy")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Monthly Total</span>
                    <span className="text-primary">₹{totalMonthly.toLocaleString()}</span>
                  </div>
                  {planDuration === "annual" && (
                    <Badge variant="secondary" className="w-full justify-center">
                      10% Annual Discount Applied
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Create Plan Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCreatePlan}
                  disabled={selectedItems.length === 0 || !selectedDate}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Create Monthly Plan
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  No payment required now. Billing starts with first delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
