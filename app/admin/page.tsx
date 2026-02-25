"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  TruckIcon,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Video,
  MapPin,
  Search,
  Filter,
  ArrowLeft,
  Package,
  Sprout,
  Clock,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingFarmers, setPendingFarmers] = useState([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [loadingApproved, setLoadingApproved] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      router.push("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    if (selectedTab === "orders") {
      fetchOrders();
    }
    if (selectedTab === "farmers") {
      fetchPendingApplications();
    }
    if (selectedTab === "approved") {
      fetchApprovedUsers();
    }
  }, [selectedTab]);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchApprovedUsers = async () => {
    setLoadingApproved(true);
    try {
      const response = await fetch('/api/admin/approved-users');
      const data = await response.json();
      setApprovedUsers(data.approvedUsers || []);
    } catch (error) {
      console.error('Failed to fetch approved users:', error);
    } finally {
      setLoadingApproved(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApplications = async () => {
    setLoadingPending(true);
    try {
      const response = await fetch('/api/admin/pending-kyc');
      const data = await response.json();
      setPendingFarmers(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch pending applications:', error);
    } finally {
      setLoadingPending(false);
    }
  };

  // Dashboard Stats
  const stats = {
    totalOrders: 156,
    activeOrders: 12,
    totalRevenue: 456780,
    todayRevenue: 45600,
    totalFarmers: 48,
    verifiedFarmers: 42,
    totalDrivers: 24,
    activeDrivers: 18,
    totalCustomers: 342,
    pendingApprovals: 5,
  };



  const handleRevoke = async (user: any) => {
    try {
      const response = await fetch('/api/admin/revoke-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: user.phone, role: user.role }),
      });
      
      if (response.ok) {
        alert(`${user.name}'s ${user.role} approval has been revoked.`);
        fetchApprovedUsers();
      }
    } catch (error) {
      alert('Failed to revoke approval. Please try again.');
    }
  };

  const handleApprove = async (applicant: any) => {
    try {
      const response = await fetch('/api/admin/approve-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: applicant.phone, role: applicant.role }),
      });
      
      if (response.ok) {
        // Update user in localStorage
        const userData = localStorage.getItem('melody_current_user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.phone === applicant.phone) {
            user.roles = user.roles || [];
            if (!user.roles.includes(applicant.role)) {
              user.roles.push(applicant.role);
            }
            user[`${applicant.role}Status`] = 'approved';
            localStorage.setItem('melody_current_user', JSON.stringify(user));
          }
        }
        alert(`${applicant.name} approved! User can now switch to ${applicant.role} role.`);
        fetchPendingApplications();
      }
    } catch (error) {
      alert('Failed to approve. Please try again.');
    }
  };

  // Live Orders
  const liveOrders = [
    {
      id: "ORD-2401",
      customer: "Rahul K.",
      farmer: "Raju Goats",
      driver: "Ramesh Kumar",
      product: "Goat - 24-26kg",
      amount: 18750,
      status: "in_transit",
      eta: "12 mins",
      progress: 75,
      // Minimum guaranteed weight used for billing
      minimumGuaranteedWeight: 24,
    },
    {
      id: "ORD-2402",
      customer: "Function Hall",
      farmer: "Lakshmi Farms",
      driver: "Sunil P.",
      product: "Bulk - 4 Goats",
      amount: 75000,
      status: "pickup",
      eta: "25 mins",
      progress: 30,
    },
    {
      id: "ORD-2403",
      customer: "Priya M.",
      farmer: "Krishna Dairy",
      driver: "Not Assigned",
      product: "Milk - 10L",
      amount: 650,
      status: "pending",
      eta: "-",
      progress: 0,
    },
  ];

  // Sample product stock (weight ranges only - no exact weight stored)
  const stockProducts = [
    {
      id: "P-1",
      farmer: "Raju Goat",
      type: "Goat",
      breed: "Osmanabadi",
      weightRangeMin: 24,
      weightRangeMax: 26,
      minimumGuaranteedWeight: 24,
      available: 5,
      price: 18000,
    },
    {
      id: "P-2",
      farmer: "Lakshmi Farms",
      type: "Desi Chicken",
      breed: "Country Chicken",
      weightRangeMin: 1.2,
      weightRangeMax: 1.8,
      minimumGuaranteedWeight: 1.2,
      available: 25,
      price: 420,
    },
    {
      id: "P-3",
      farmer: "Krishna Dairy",
      type: "Buffalo Milk",
      breed: "Murrah Buffalo",
      weightRangeMin: 1,
      weightRangeMax: 1,
      minimumGuaranteedWeight: 1,
      available: 50,
      price: 65,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_transit":
        return (
          <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
            <TruckIcon className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        );
      case "pickup":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pickup
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/customer">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                  Admin Control Panel
                </h1>
                <p className="text-sm text-muted-foreground">
                  Melody Platform Management
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-accent text-accent-foreground gap-1">
                <ShieldCheck className="h-3 w-3" />
                Super Admin
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("admin_authenticated");
                  router.push("/admin/login");
                }}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Orders
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {stats.totalOrders}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600 font-semibold">
                      {stats.activeOrders} active
                    </span>
                  </p>
                </div>
                <ShoppingBag className="h-12 w-12 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-green-700 flex items-center">
                    <IndianRupee className="h-5 w-5" />
                    {(stats.totalRevenue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Today: ₹{stats.todayRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-12 w-12 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Farmers</p>
                  <p className="text-3xl font-bold text-secondary">
                    {stats.totalFarmers}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600 font-semibold">
                      {stats.verifiedFarmers} verified
                    </span>
                  </p>
                </div>
                <Sprout className="h-12 w-12 text-secondary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Drivers</p>
                  <p className="text-3xl font-bold text-accent-foreground">
                    {stats.totalDrivers}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-600 font-semibold">
                      {stats.activeDrivers} online
                    </span>
                  </p>
                </div>
                <TruckIcon className="h-12 w-12 text-accent opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="farmers" className="gap-2">
              <Sprout className="h-4 w-4" />
              <span className="hidden sm:inline">Pending</span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Approved</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="weights" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Weights</span>
            </TabsTrigger>
            <TabsTrigger value="drivers" className="gap-2">
              <TruckIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Drivers</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Pending Approvals Alert */}
            {pendingFarmers.length > 0 && (
              <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-800">
                        Pending KYC Approvals
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {pendingFarmers.length} applications waiting for
                        verification
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedTab("farmers")}
                      className="bg-transparent border-yellow-600 text-yellow-700"
                    >
                      Review Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Live Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Live Orders Tracking
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className="bg-green-500/10 text-green-700 border-green-500/20"
                  >
                    {stats.activeOrders} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold">{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.product}
                            </p>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Customer
                            </p>
                            <p className="font-medium">{order.customer}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Farmer
                            </p>
                            <p className="font-medium">{order.farmer}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Driver
                            </p>
                            <p className="font-medium">{order.driver}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Amount
                            </p>
                            <p className="font-bold text-primary text-lg">
                              ₹{order.amount.toLocaleString()}
                            </p>
                          </div>
                          {order.eta !== "-" && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                ETA
                              </p>
                              <p className="font-semibold">{order.eta}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/customer/track/${order.id}`}
                            className="flex-1"
                          >
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full gap-1 bg-transparent"
                            >
                              <MapPin className="h-4 w-4" />
                              Track
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 gap-1 bg-transparent"
                          >
                            <Video className="h-4 w-4" />
                            View Videos
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Farmers Tab */}
          <TabsContent value="farmers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Pending Applications</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search farmers..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Pending Approvals */}
            <Card className="border-2 border-yellow-500/30">
              <CardHeader className="bg-yellow-500/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Pending Approvals ({pendingFarmers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {loadingPending ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50 animate-spin" />
                    <p>Loading applications...</p>
                  </div>
                ) : pendingFarmers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No pending applications</p>
                  </div>
                ) : (
                  pendingFarmers.map((farmer: any) => (
                    <Card key={farmer.id} className="border">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-lg">{farmer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {farmer.village} • {farmer.phone}
                              </p>
                              <p className="text-sm mt-1">
                                <span className="text-muted-foreground">
                                  Products:
                                </span>{" "}
                                {farmer.products}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
                            >
                              Pending Review
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="flex items-center gap-2">
                              {farmer.documents.aadhaar ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">Aadhaar</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {farmer.documents.pan ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">PAN</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {farmer.documents.photo ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">Photo</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {farmer.videoUploaded ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">Video</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 bg-primary hover:bg-primary/90"
                              onClick={() => handleApprove(farmer)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1 bg-transparent"
                            >
                              <Video className="h-4 w-4" />
                              View Documents
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                              onClick={() => {
                                alert(
                                  `${farmer.name}'s application has been rejected.`
                                );
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approved Users Tab */}
          <TabsContent value="approved" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Approved Users</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search approved users..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Card className="border-2 border-green-500/30">
              <CardHeader className="bg-green-500/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Approved Users ({approvedUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {loadingApproved ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-50 animate-spin" />
                    <p>Loading approved users...</p>
                  </div>
                ) : approvedUsers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No approved users yet</p>
                  </div>
                ) : (
                  approvedUsers.map((user: any) => (
                    <Card key={`${user.phone}-${user.role}`} className="border">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-lg">{user.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {user.phone} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Approved: {new Date(user.approvedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-700 border-green-500/20"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          </div>

                          {/* Role-specific details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            {user.role === 'farmer' && (
                              <>
                                <div>
                                  <p className="text-xs text-muted-foreground">Village</p>
                                  <p className="font-medium">{user.details.village}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Products</p>
                                  <p className="font-medium">{user.details.products}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Farm Size</p>
                                  <p className="font-medium">{user.details.farmSize}</p>
                                </div>
                              </>
                            )}
                            {user.role === 'driver' && (
                              <>
                                <div>
                                  <p className="text-xs text-muted-foreground">Vehicle Type</p>
                                  <p className="font-medium">{user.details.vehicleType}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Vehicle Number</p>
                                  <p className="font-medium">{user.details.vehicleNumber}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">License</p>
                                  <p className="font-medium">{user.details.license}</p>
                                </div>
                              </>
                            )}
                            {user.role === 'employer' && (
                              <>
                                <div>
                                  <p className="text-xs text-muted-foreground">Business Name</p>
                                  <p className="font-medium">{user.details.businessName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Business Type</p>
                                  <p className="font-medium">{user.details.businessType}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">GST</p>
                                  <p className="font-medium">{user.details.gst}</p>
                                </div>
                              </>
                            )}
                            {user.role === 'student' && (
                              <>
                                <div>
                                  <p className="text-xs text-muted-foreground">Age</p>
                                  <p className="font-medium">{user.details.age}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Institution</p>
                                  <p className="font-medium">{user.details.institution}</p>
                                </div>
                                <div></div>
                              </>
                            )}
                            {user.role === 'worker' && (
                              <>
                                <div>
                                  <p className="text-xs text-muted-foreground">Age</p>
                                  <p className="font-medium">{user.details.age}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Aadhar Number</p>
                                  <p className="font-medium">{user.details.aadharNumber}</p>
                                </div>
                                <div></div>
                              </>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1 bg-transparent"
                            >
                              <Video className="h-4 w-4" />
                              View Profile
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1 bg-transparent border-red-500/20 text-red-700 hover:bg-red-500/10"
                              onClick={() => {
                                if (confirm(`Are you sure you want to revoke ${user.name}'s ${user.role} approval?`)) {
                                  handleRevoke(user);
                                }
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weights Tab */}
          <TabsContent value="weights" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Minimum Guaranteed Weights</h2>
              <div className="flex gap-2">
                <Button variant="outline">Export</Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stockProducts.map((p) => (
                  <Card key={p.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold">
                            {p.type} • {p.breed}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {p.farmer}
                          </p>
                          <p className="text-sm mt-1">
                            Range:{" "}
                            <span className="font-medium">
                              {p.weightRangeMin}-{p.weightRangeMax}kg
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum guaranteed:{" "}
                            <span className="font-medium">
                              {p.minimumGuaranteedWeight}kg
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Available
                          </p>
                          <p className="font-medium">{p.available} units</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Price/kg
                          </p>
                          <p className="font-bold text-primary">₹{p.price}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Orders (using min guaranteed weight)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {liveOrders.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div>
                      <p className="font-bold">
                        {o.id} — {o.product}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {o.customer} • {o.farmer}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">
                        Minimum guaranteed
                      </p>
                      <p className="font-medium">
                        {o.minimumGuaranteedWeight
                          ? `${o.minimumGuaranteedWeight}kg`
                          : "—"}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">All Orders</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-transparent"
                  onClick={fetchOrders}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Refresh"}
                </Button>
              </div>
            </div>
            
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Loading orders...</p>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No orders found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <Card key={order._id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold">{order._id}</p>
                            <p className="text-sm text-muted-foreground">
                              Customer: {order.customerId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <Badge className={`${
                            order.status === 'pending' 
                              ? 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
                              : order.status === 'completed'
                              ? 'bg-green-500/10 text-green-700 border-green-500/20'
                              : 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                          }`}>
                            {order.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Total Amount</p>
                            <p className="font-bold text-primary text-lg">
                              ₹{order.totalAmount?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Payment Method</p>
                            <p className="font-medium">{order.paymentMethod || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Items</p>
                            <p className="font-medium">{order.items?.length || 0} items</p>
                          </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                          <div className="border-t pt-3">
                            <p className="text-xs text-muted-foreground mb-2">Order Items:</p>
                            <div className="space-y-1">
                              {order.items.map((item: any, index: number) => (
                                <div key={index} className="text-sm flex justify-between">
                                  <span>{item.productType} - {item.breed} (x{item.quantity})</span>
                                  <span className="font-medium">₹{item.totalPrice}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {order.deliveryAddress && (
                          <div className="border-t pt-3">
                            <p className="text-xs text-muted-foreground">Delivery Address:</p>
                            <p className="text-sm">{order.deliveryAddress}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Drivers Tab */}
          <TabsContent value="drivers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Driver Management</h2>
              <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
                {stats.activeDrivers} Online Now
              </Badge>
            </div>
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                <TruckIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Driver management coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
