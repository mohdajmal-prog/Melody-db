"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RazorpayPaymentModal } from "@/components/razorpay-payment-modal";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const router = useRouter();
  const [step, setStep] = useState<
    "cart" | "address" | "payment" | "confirmation"
  >("cart");
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartSummary,
    clearCart,
  } = useCart();

  const [address, setAddress] = useState({
    fullAddress: "",
    landmark: "",
    phone: "",
    deliveryInstructions: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const subtotal = cartSummary.subtotal;
  const deliveryFee = 50;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryFee + gst;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    setStep("address");
  };

  const handleAddressSubmit = () => {
    if (!address.fullAddress || !address.phone) {
      alert("Please fill all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePayment = () => {
    if (paymentMethod === "cod") {
      setStep("confirmation");
    } else {
      setShowPaymentModal(true);
    }
  };

  const [orderId, setOrderId] = useState(
    () => `ORD-${Math.floor(Math.random() * 10000)}`
  );

  const handlePaymentSuccess = async (paymentId: string) => {
    console.log("[v0] Payment successful:", paymentId);

    try {
      // Get current user from localStorage (demo auth)
      const currentUser = localStorage.getItem("melody_current_user");
      if (!currentUser) {
        alert("User not authenticated. Please login again.");
        router.push("/auth");
        return;
      }

      const user = JSON.parse(currentUser);
      const customerId = user.phone; // Using phone as customer ID for demo

      // Prepare order data
      const deliveryAddressString = `${address.fullAddress}${
        address.landmark ? `, Landmark: ${address.landmark}` : ""
      }${
        address.deliveryInstructions
          ? `, Instructions: ${address.deliveryInstructions}`
          : ""
      }`;

      const orderData = {
        customerId,
        items: cartItems.map((item) => ({
          farmerId: item.farmer_id,
          productType: item.product_type,
          breed: item.breed,
          quantity: item.quantity,
          price: item.price_per_unit,
          weight: item.weight,
          minimumGuaranteedWeight: item.minimum_guaranteed_weight,
        })),
        totalAmount: subtotal,
        deliveryAddress: deliveryAddressString,
        paymentMethod,
        paymentId,
        deliveryFee,
        gst,
      };

      // Create order in database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      console.log("Order created:", result);

      // Clear cart after successful order
      clearCart();

      // Update orderId for confirmation screen
      setOrderId(result.orderId);

      setShowPaymentModal(false);
      setStep("confirmation");
    } catch (error) {
      console.error("Order creation failed:", error);
      alert(
        "Payment successful but order creation failed. Please contact support."
      );
      setShowPaymentModal(false);
    }
  };

  if (step === "confirmation") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-green-500/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
              <p className="text-muted-foreground">Order ID: {orderId}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Order Total:
                </span>
                <span className="font-bold text-primary">
                  ₹{total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Delivery ETA:
                </span>
                <span className="font-medium">45-60 minutes</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800 font-medium">
                Live animal weight may vary naturally. You were charged only for
                the minimum guaranteed weight.
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-blue-900 mb-2">
                What's Next?
              </p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ Farmer is preparing your order</li>
                <li>✓ Driver will be assigned shortly</li>
                <li>✓ Live GPS tracking available</li>
                <li>✓ Video verification at each step</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <Link href="/customer" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
              <Button
                className="flex-1"
                onClick={() => router.push(`/customer/track/${orderId}`)}
              >
                Track Order
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() =>
                step === "cart" ? router.push("/customer") : setStep("cart")
              }
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {step === "cart" && "Shopping Cart"}
                {step === "address" && "Delivery Address"}
                {step === "payment" && "Payment"}
              </h1>
              <p className="text-sm text-white/90">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Cart Step */}
        {step === "cart" && (
          <div className="space-y-6">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add products from farmers to get started
                  </p>
                  <Link href="/customer">
                    <Button>Start Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Cart Items */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <p className="font-bold">{item.product_type}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.breed}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.farmerName || "Farmer"}, {item.farmerVillage || "Village"}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-sm text-muted-foreground">
                                Weight:
                              </span>
                              <span className="font-medium">{item.weight || "N/A"}</span>
                            </div>
                            {item.minimum_guaranteed_weight && (
                              <div className="mt-1">
                                <p className="text-xs text-muted-foreground">
                                  Minimum guaranteed weight:{" "}
                                  <span className="font-medium">
                                    {item.minimum_guaranteed_weight}kg
                                  </span>
                                </p>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">
                                Available:
                              </span>
                              <span className="font-medium text-primary">
                                {item.available || 10} units
                              </span>
                            </div>
                          </div>

                          <div className="text-right space-y-3">
                            <p className="text-lg font-bold text-primary">
                              ₹
                              {(
                                item.price_per_unit * item.quantity
                              ).toLocaleString()}
                            </p>

                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                                disabled={item.quantity <= 1}
                                onClick={() => decreaseQuantity(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                                disabled={
                                  item.quantity >= (item.available || 10)
                                }
                                onClick={() => increaseQuantity(item.id)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Price Summary */}
                <Card className="border-2 border-primary/20 bg-primary/5">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-medium">
                        ₹{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery Fee:
                      </span>
                      <span className="font-medium">₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (5%):</span>
                      <span className="font-medium">₹{gst}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t text-lg">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-primary">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Button onClick={handleCheckout} size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </>
            )}
          </div>
        )}

        {/* Address Step */}
        {step === "address" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullAddress">Complete Address *</Label>
                  <Textarea
                    id="fullAddress"
                    placeholder="Flat/House No, Building Name, Street, Area"
                    value={address.fullAddress}
                    onChange={(e) =>
                      setAddress({ ...address, fullAddress: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    placeholder="Nearby landmark for easy location"
                    value={address.landmark}
                    onChange={(e) =>
                      setAddress({ ...address, landmark: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryInstructions">
                    Delivery Instructions
                  </Label>
                  <Textarea
                    id="deliveryInstructions"
                    placeholder="Any specific instructions for driver (optional)"
                    value={address.deliveryInstructions}
                    onChange={(e) =>
                      setAddress({
                        ...address,
                        deliveryInstructions: e.target.value,
                      })
                    }
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleAddressSubmit} size="lg" className="w-full">
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Payment Step */}
        {step === "payment" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex-1 cursor-pointer">
                      <p className="font-medium">UPI Payment</p>
                      <p className="text-xs text-muted-foreground">
                        Google Pay, PhonePe, Paytm, etc.
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <p className="font-medium">Credit / Debit Card</p>
                      <p className="text-xs text-muted-foreground">
                        Visa, Mastercard, Rupay
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Label
                      htmlFor="netbanking"
                      className="flex-1 cursor-pointer"
                    >
                      <p className="font-medium">Net Banking</p>
                      <p className="text-xs text-muted-foreground">
                        All major banks supported
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">
                        Pay when you receive
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  <span>
                    Escrow protected - Money released after delivery
                    confirmation
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">
                    Live animal weight may vary naturally. You will be charged
                    only for the minimum guaranteed weight.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handlePayment}
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
            >
              Pay ₹{total.toLocaleString()}
            </Button>
          </div>
        )}
      </div>

      {/* Razorpay Payment Modal */}
      <RazorpayPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        amount={total}
        orderDetails={{
          orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
          description: `${cartItems.length} items`,
        }}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
