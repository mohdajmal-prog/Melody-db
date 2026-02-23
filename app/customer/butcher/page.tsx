"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, Beef, Hash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ButcherServicePage() {
  const router = useRouter();
  const [booked, setBooked] = useState(false);
  const [formData, setFormData] = useState({
    numberOfButchers: "1",
    meatType: "",
    animalCount: "",
    address: "",
    date: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Book Butcher Service</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {booked ? (
          <Card className="bg-white border-2 border-green-200 shadow-lg">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-700">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your butcher service has been booked successfully.</p>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-left space-y-2">
                <p className="text-lg font-bold text-green-800">Butcher: Piroji</p>
                <p className="text-sm text-gray-600">Contact: +91 98765 43210</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-left space-y-2">
                <p><span className="font-semibold">Butchers:</span> {formData.numberOfButchers}</p>
                <p><span className="font-semibold">Meat Type:</span> {formData.meatType}</p>
                <p><span className="font-semibold">Animal Count:</span> {formData.animalCount}</p>
                <p><span className="font-semibold">Date:</span> {formData.date}</p>
                <p><span className="font-semibold">Time:</span> {formData.time}</p>
              </div>
              <Button onClick={() => router.push("/customer")} size="lg" className="w-full">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
        <Card className="bg-white border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl">Service Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="butchers" className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Number of Butchers
                </Label>
                <Select value={formData.numberOfButchers} onValueChange={(value) => setFormData({...formData, numberOfButchers: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Butcher</SelectItem>
                    <SelectItem value="2">2 Butchers</SelectItem>
                    <SelectItem value="3">3 Butchers</SelectItem>
                    <SelectItem value="4">4 Butchers</SelectItem>
                    <SelectItem value="5">5+ Butchers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meatType" className="flex items-center gap-2">
                  <Beef className="h-4 w-4 text-primary" />
                  Meat Type
                </Label>
                <Select value={formData.meatType} onValueChange={(value) => setFormData({...formData, meatType: value})} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="goat">Goat</SelectItem>
                    <SelectItem value="sheep">Sheep</SelectItem>
                    <SelectItem value="chicken">Chicken</SelectItem>
                    <SelectItem value="buffalo">Buffalo</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="count" className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Animal Count
                </Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  placeholder="Enter number of animals"
                  value={formData.animalCount}
                  onChange={(e) => setFormData({...formData, animalCount: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Service Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Service Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Service Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address where service is needed"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full shadow-lg hover:shadow-xl transition-all">
                Book Butcher Service
              </Button>
            </form>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}
