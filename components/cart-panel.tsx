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
  X,
  ShoppingCart,
  Trash2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CartPanel({ isOpen, onClose }: CartPanelProps) {
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

  const [orderId] = useState(() => `ORD-${Math.floor(Math.random() * 10000)}`);

  const handlePaymentSuccess = (paymentId: string) => {
    console.log("[v0] Payment successful:", paymentId);
    setShowPaymentModal(false);
    setStep("confirmation");
  };

  const resetPanel = () => {
    setStep("cart");
    setAddress({
      fullAddress: "",
      landmark: "",
      phone: "",
      deliveryInstructions: "",
    });
    setPaymentMethod("upi");
    setShowPaymentModal(false);
  };

  const handleClose = () => {
    resetPanel();
    onClose();
  };

  if (step === "confirmation") {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        />

        {/* Confirmation Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-2 border-green-500/30">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground">
                  Order ID: {orderId}
                </p>
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
                  Live animal weight may vary naturally. You were charged only for the minimum guaranteed weight.
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
                <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Continue Shopping
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    handleClose();
                    router.push(`/customer/track/${orderId}`);
                  }}
                >
                  Track Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background border-l shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              {step === "cart" && "Shopping Cart"}
              {step === "address" && "Delivery Address"}
              {step === "payment" && "Payment"}
            </h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Cart Step */}
            {step === "cart" && (
              <div className="p-4 space-y-4">
                {cartItems.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-lg font-medium mb-2">Your cart is empty</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Add products from farmers to get started
                      </p>
                      <Button onClick={handleClose} variant="outline">
                        Continue Shopping
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    {/* Cart Items */}
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <p className="font-bold text-sm">{item.productType}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.breed}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.farmerName}, {item.farmerVillage}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-muted-foreground">
                                    Weight:
                                  </span>
                                  <span className="font-medium text-xs">{item.weight}</span>
                                </div>
                                {item.minimumGuaranteedWeight && (
                                  <div className="mt-1">
                                    <p className="text-xs text-muted-foreground">Min: <span className="font-medium">{item.minimumGuaranteedWeight}kg</span></p>
                                  </div>
                                )}
                              </div>

                              <div className="text-right space-y-2">
                                <p className="text-sm font-bold text-primary">
                                  ₹{(item.price * item.quantity).toLocaleString()}
                                </p>

                                <div className="flex items-center gap-1">
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6 bg-transparent"
                                    disabled={item.quantity <= 1}
                                    onClick={() => decreaseQuantity(item.id)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-6 text-center font-semibold text-xs">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6 bg-transparent"
                                    disabled={item.quantity >= item.available}
                                    onClick={() => increaseQuantity(item.id)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-6 px-2"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Price Summary */}
                    <Card className="border-2 border-primary/20 bg-primary/5">
                      <CardContent className="p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium">
                            ₹{subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Delivery Fee:
                          </span>
                          <span className="font-medium">₹{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">GST (5%):</span>
                          <span className="font-medium">₹{gst}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t text-base">
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
              <div className="p-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-4 w-4 text-primary" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="fullAddress" className="text-sm">Complete Address *</Label>
                      <Textarea
                        id="fullAddress"
                        placeholder="Flat/House No, Building Name, Street, Area"
                        value={address.fullAddress}
                        onChange={(e) =>
                          setAddress({ ...address, fullAddress: e.target.value })
                        }
                        rows={3}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landmark" className="text-sm">Landmark</Label>
                      <Input
                        id="landmark"
                        placeholder="Nearby landmark for easy location"
                        value={address.landmark}
                        onChange={(e) =>
                          setAddress({ ...address, landmark: e.target.value })
                        }
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm">Contact Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={address.phone}
                        onChange={(e) =>
                          setAddress({ ...address, phone: e.target.value })
                        }
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deliveryInstructions" className="text-sm">
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
                        className="text-sm"
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
              <div className="p-4 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IndianRupee className="h-4 w-4 text-primary" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex-1 cursor-pointer text-sm">
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-xs text-muted-foreground">
                            Google Pay, PhonePe, Paytm, etc.
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer text-sm">
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-xs text-muted-foreground">
                            Visa, Mastercard, Rupay
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label
                          htmlFor="netbanking"
                          className="flex-1 cursor-pointer text-sm"
                        >
                          <p className="font-medium">Net Banking</p>
                          <p className="text-xs text-muted-foreground">
                            All major banks supported
                          </p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer text-sm">
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
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-sm">Total Amount:</span>
                      <span className="text-xl font-bold text-primary">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <ShieldCheck className="h-3 w-3 text-green-600" />
                      <span>
                        Escrow protected - Money released after delivery
                        confirmation
                      </span>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                      <p className="text-xs text-blue-800 font-medium">
                        Live animal weight may vary naturally. You will be charged only for the minimum guaranteed weight.
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
        </div>
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
    </>
  );
}
