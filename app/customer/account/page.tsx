"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Save,
  X,
  ShoppingBag,
  Heart,
  CreditCard,
  Star,
} from "lucide-react";

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 9876543210",
    address: "123 Main Street, Hyderabad, Telangana",
    avatar: "/placeholder-user.jpg",
  });

  const handleSave = () => {
    // TODO: Implement save to backend
    alert("Profile updated successfully!");
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original values
    setProfile({
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+91 9876543210",
      address: "123 Main Street, Hyderabad, Telangana",
      avatar: "/placeholder-user.jpg",
    });
    setIsEditing(false);
  };

  const accountStats = {
    totalOrders: 24,
    wishlistItems: 8,
    totalSpent: 15420,
    averageRating: 4.8,
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-white">My Account</h1>
          <p className="text-sm text-white/90">Manage your profile and account settings</p>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Card */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="shadow-sm hover:shadow-md transition-all"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm" className="shadow-md hover:shadow-lg transition-all">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-2 ring-gray-100">
                  <AvatarImage src={profile.avatar} alt={profile.name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-2xl font-bold">
                    {profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md transition-all">
                    Change Photo
                  </Button>
                )}
              </div>

              <Separator />

              {/* Profile Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) =>
                      setProfile({ ...profile, address: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Overview */}
          <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="text-xl">Account Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
                      <ShoppingBag className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-700">
                    {accountStats.totalOrders}
                  </div>
                  <div className="text-sm text-blue-600 font-medium mt-1">Total Orders</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-md">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-700">
                    {accountStats.wishlistItems}
                  </div>
                  <div className="text-sm text-red-600 font-medium mt-1">Wishlist Items</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-700">
                    ₹{accountStats.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 font-medium mt-1">Total Spent</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-amber-700">
                    {accountStats.averageRating}
                  </div>
                  <div className="text-sm text-amber-600 font-medium mt-1">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your order history will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Account settings and preferences will appear here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
