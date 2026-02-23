"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChefHat,
  Users,
  Calendar,
  Package,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
  Star,
} from "lucide-react";

interface BulkOrderFormProps {
  product: {
    id: string;
    type: string;
    breed: string;
    price: number;
    weightRangeMin: number;
    weightRangeMax: number;
    available: number;
  };
  farmer: {
    id: number;
    name: string;
    village: string;
    distance: number;
    rating: number;
  };
  onSubmit: (orderData: any) => void;
}

const eventTypes = [
  { value: "Wedding", label: "Wedding Ceremony", icon: "💒" },
  { value: "Marriage Hall", label: "Marriage Hall Event", icon: "🏛️" },
  { value: "Function Hall", label: "Function Hall Event", icon: "🎪" },
  { value: "Birthday Party", label: "Birthday Celebration", icon: "🎂" },
  { value: "Anniversary", label: "Anniversary Party", icon: "💕" },
  { value: "Corporate Event", label: "Corporate Function", icon: "🏢" },
  { value: "Festival Celebration", label: "Festival Event", icon: "🎊" },
  { value: "Religious Ceremony", label: "Religious Function", icon: "🕉️" },
  { value: "Other", label: "Other Event", icon: "🎉" },
];

export default function BulkOrderForm({ product, farmer, onSubmit }: BulkOrderFormProps) {
  const [bulkQuantity, setBulkQuantity] = useState(20);
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  const pricePerKg = Math.round(product.price / product.weightRangeMin);
  const bulkDiscount = 0.1; // 10% discount
  const totalAmount = Math.round(pricePerKg * bulkQuantity * (1 - bulkDiscount));
  const savedAmount = Math.round(pricePerKg * bulkQuantity * bulkDiscount);

  const handleSubmit = () => {
    const orderData = {
      productId: product.id,
      farmerId: farmer.id,
      quantity: bulkQuantity,
      eventType,
      eventDate,
      deliveryTime,
      guestCount: parseInt(guestCount) || 0,
      specialRequirements,
      totalAmount,
    };
    onSubmit(orderData);
  };

  const isFormValid = eventType && eventDate && bulkQuantity >= 20;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <ChefHat className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-blue-900 dark:text-blue-100 text-lg">
              Bulk Orders for Special Events
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
              Perfect for weddings, marriage halls, function halls, birthday parties, and corporate events.
              <span className="block mt-1 font-medium">✨ Minimum order: 20kg • Special event pricing • Professional service</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                Marriage Halls
              </Badge>
              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                Weddings
              </Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                Corporate Events
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Farmer Info for Bulk Orders */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ChefHat className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">{farmer.name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {farmer.village} • {farmer.distance}km away
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{farmer.rating}</span>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              🏆 Verified for bulk orders • 50+ successful events delivered
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Form */}
      <div className="space-y-4">
        {/* Quantity */}
        <div>
          <Label htmlFor="bulk-quantity" className="text-base font-semibold">
            Quantity (kg) - Minimum: 20kg
          </Label>
          <div className="flex items-center gap-3 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBulkQuantity(Math.max(20, bulkQuantity - 5))}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="bulk-quantity"
              type="number"
              value={bulkQuantity}
              onChange={(e) => setBulkQuantity(Math.max(20, parseInt(e.target.value) || 20))}
              className="text-center text-lg font-semibold h-10"
              min={20}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBulkQuantity(bulkQuantity + 5)}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Recommended: 0.5kg per person for main course
          </p>
        </div>

        {/* Event Type */}
        <div>
          <Label className="text-base font-semibold">Event Type</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {eventTypes.map((type) => (
              <Button
                key={type.value}
                variant={eventType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setEventType(type.value)}
                className="justify-start gap-2 h-auto p-3"
              >
                <span className="text-lg">{type.icon}</span>
                <span className="text-xs">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Event Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="event-date" className="text-base font-semibold">
              Event Date
            </Label>
            <Input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-2"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <Label htmlFor="delivery-time" className="text-base font-semibold">
              Preferred Delivery Time
            </Label>
            <select
              id="delivery-time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full mt-2 px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="">Select Time</option>
              <option value="Early Morning (6-8 AM)">Early Morning (6-8 AM)</option>
              <option value="Morning (8-10 AM)">Morning (8-10 AM)</option>
              <option value="Late Morning (10-12 PM)">Late Morning (10-12 PM)</option>
              <option value="Afternoon (12-2 PM)">Afternoon (12-2 PM)</option>
              <option value="Evening (4-6 PM)">Evening (4-6 PM)</option>
            </select>
          </div>
        </div>

        {/* Guest Count */}
        <div>
          <Label htmlFor="guest-count" className="text-base font-semibold">
            Expected Guest Count (Optional)
          </Label>
          <Input
            id="guest-count"
            type="number"
            placeholder="e.g., 100"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="mt-2"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Helps us recommend the right quantity
          </p>
        </div>

        {/* Special Requirements */}
        <div>
          <Label htmlFor="special-requirements" className="text-base font-semibold">
            Special Requirements (Optional)
          </Label>
          <Textarea
            id="special-requirements"
            placeholder="Any specific cutting style, delivery instructions, or other requirements..."
            value={specialRequirements}
            onChange={(e) => setSpecialRequirements(e.target.value)}
            className="mt-2"
            rows={3}
          />
        </div>
      </div>

      {/* Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Quantity</span>
            <span className="font-semibold">{bulkQuantity}kg</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Price per kg</span>
            <span className="font-semibold">₹{pricePerKg}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">₹{(pricePerKg * bulkQuantity).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bulk Discount (10%)</span>
            <span className="font-semibold text-green-600">-₹{savedAmount.toLocaleString()}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">Total Amount</span>
            <span className="text-2xl font-bold text-primary">₹{totalAmount.toLocaleString()}</span>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              💰 You save ₹{savedAmount.toLocaleString()} with bulk pricing!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Bulk Order Benefits
        </h4>
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
            <Users className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Dedicated event coordinator & 24/7 support</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Guaranteed delivery on your event date</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
            <Package className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Professional cutting, cleaning & packaging</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-gray-800/50 rounded-md">
            <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Quality guarantee with video verification</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        className="w-full h-12 text-lg"
        size="lg"
        onClick={handleSubmit}
        disabled={!isFormValid}
      >
        <ChefHat className="h-5 w-5 mr-2" />
        Request Bulk Order Quote
      </Button>

      {!isFormValid && (
        <p className="text-sm text-muted-foreground text-center">
          Please fill in event type, date, and ensure minimum quantity of 20kg
        </p>
      )}
    </div>
  );
}