"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  Video,
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const userData = localStorage.getItem("melody_current_user");
        if (!userData) {
          router.push("/auth");
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(userData);
        } catch (error) {
          setError("Invalid user data. Please log in again.");
          router.push("/auth");
          return;
        }

        if (!parsed || !parsed.phone) {
          setError("Invalid user data. Please log in again.");
          router.push("/auth");
          return;
        }
        setUser(parsed);

        // Fetch orders from API
        const response = await fetch(`/api/orders?customerId=${parsed.phone}`);
        if (!response.ok) {
          // If API fails, show empty orders instead of error
          console.warn('Failed to fetch orders from API, showing empty state');
          setOrders([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  // Separate orders into active and completed
  const activeOrders = orders.filter((order) =>
    ["pending", "confirmed", "preparing", "in_transit"].includes(order.status)
  );

  const completedOrders = orders.filter((order) =>
    ["delivered", "cancelled"].includes(order.status)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_transit":
        return (
          <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20">
            <MapPin className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        );
      case "preparing":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Preparing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gray-500/10 text-gray-700 border-gray-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        );
      case "delivered":
        return (
          <Badge className="bg-green-500/10 text-green-700 border-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500/10 text-red-700 border-red-500/20">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-500/10 text-gray-700 border-gray-500/20">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="h-5 w-5" />
                My Orders
              </h1>
              <p className="text-sm text-white/90">
                Track and manage your orders
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger
              value="active"
              className="gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Active </span>(
              {activeOrders.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="gap-2 text-xs sm:text-sm py-2 sm:py-3"
            >
              <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Completed </span>(
              {completedOrders.length})
            </TabsTrigger>
          </TabsList>

          {/* Active Orders */}
          <TabsContent value="active" className="space-y-4">
            {activeOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium mb-2">No active orders</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start shopping for fresh farm products
                  </p>
                  <Link href="/customer">
                    <Button>Browse Products</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              activeOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="pb-3 bg-muted/30">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{order.id}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatDate(order.created_at)} •{" "}
                          {formatTime(order.created_at)}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    <div className="space-y-2">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id || `${order.id}-${item.product_type}-${item.farmer_id}`}>
                          <p className="font-semibold">
                            {item.product_type} ({item.quantity}{" "}
                            {item.weight ? `${item.weight}kg` : "units"})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.farmer?.name ||
                              `Farmer ID: ${item.farmer_id}`}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order Amount
                        </p>
                        <p className="text-lg font-bold text-primary">
                          ₹
                          {(
                            order.total_amount +
                            order.delivery_fee +
                            order.gst
                          ).toLocaleString()}
                        </p>
                      </div>
                      {order.status === "in_transit" && (
                        <div className="text-left sm:text-right">
                          <p className="text-sm text-muted-foreground">ETA</p>
                          <p className="font-semibold">45-60 mins</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Link
                        href={`/customer/track/${order.id}`}
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1 bg-transparent"
                        >
                          <MapPin className="h-4 w-4" />
                          Track Live
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:flex-1 gap-1 bg-transparent"
                      >
                        <Video className="h-4 w-4" />
                        View Videos
                      </Button>
                      {order.status === "in_transit" && (
                        <Link
                          href={`/customer/complaint/${order.id}`}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-1 bg-transparent"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Completed Orders */}
          <TabsContent value="completed" className="space-y-4">
            {completedOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ordered: {formatDate(order.created_at)} •{" "}
                        {formatTime(order.created_at)}
                      </p>
                      {order.status === "delivered" &&
                        order.order_tracking?.[0] && (
                          <p className="text-sm text-muted-foreground">
                            Delivered: {formatDate(order.updated_at)} •{" "}
                            {formatTime(order.updated_at)}
                          </p>
                        )}
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2">
                    {order.order_items?.map((item: any) => (
                      <div key={item.id || `${order.id}-${item.product_type}-${item.farmer_id}`}>
                        <p className="font-semibold">
                          {item.product_type} ({item.quantity}{" "}
                          {item.weight ? `${item.weight}kg` : "units"})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.farmer?.name || `Farmer ID: ${item.farmer_id}`}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Order Amount
                      </p>
                      <p className="text-lg font-bold text-primary">
                        ₹
                        {(
                          order.total_amount +
                          order.delivery_fee +
                          order.gst
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:flex-1 gap-1 bg-transparent"
                    >
                      <Video className="h-4 w-4" />
                      View Videos
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:flex-1 gap-1 bg-transparent"
                    >
                      <Package className="h-4 w-4" />
                      Order Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:flex-1 gap-1 bg-transparent"
                    >
                      Reorder
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
