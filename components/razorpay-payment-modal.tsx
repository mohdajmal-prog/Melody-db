"use client";

import { useState, useEffect, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Loader2,
  X,
  Shield,
  Lock,
} from "lucide-react";

interface RazorpayPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderDetails: {
    orderId: string;
    description: string;
    name?: string;
  };
  onSuccess: (paymentId: string) => void;
}

const RazorpayPaymentModal = forwardRef<
  React.ElementRef<typeof Dialog>,
  RazorpayPaymentModalProps
>(({ isOpen, onClose, amount, orderDetails, onSuccess }, ref) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "upi" | "card" | "netbanking"
  >("upi");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // UPI fields
  const [upiId, setUpiId] = useState("");

  // Card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Netbanking
  const [selectedBank, setSelectedBank] = useState("");

  const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
  ];

  const handlePayment = () => {
    setProcessing(true);

    // Demo validation
    if (paymentMethod === "upi" && !upiId) {
      alert("Please enter UPI ID");
      setProcessing(false);
      return;
    }

    if (paymentMethod === "card" && (!cardNumber || !cardExpiry || !cardCvv)) {
      alert("Please fill all card details");
      setProcessing(false);
      return;
    }

    if (paymentMethod === "netbanking" && !selectedBank) {
      alert("Please select a bank");
      setProcessing(false);
      return;
    }

    // Simulate payment processing delay
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);

      // Generate fake payment ID
      const paymentId = `pay_${Math.random().toString(36).substring(2, 15)}`;

      // Success callback after animation
      setTimeout(() => {
        onSuccess(paymentId);
      }, 2000);
    }, 2500);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(" ") : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0">
        {!success ? (
          <>
            {/* Header */}
            <DialogHeader className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold text-gray-900">
                    Complete Payment
                  </DialogTitle>
                  <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Powered by Razorpay
                  </p>
                </div>
              </div>
            </DialogHeader>

            {/* Order Details */}
            <div className="p-4 bg-white border-b">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Order ID</p>
                    <p className="font-semibold text-sm text-gray-900">
                      {orderDetails.orderId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹{amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <p className="text-xs text-blue-800">
                    Live animal weight may vary naturally. You will be charged only for the minimum guaranteed weight.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="p-4 space-y-3">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as any)}
              >
                <div
                  className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "upi"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setPaymentMethod("upi")}
                >
                  <RadioGroupItem value="upi" id="upi" />
                  <Label
                    htmlFor="upi"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900">UPI</span>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "card"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label
                    htmlFor="card"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900">Credit / Debit Card</span>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === "netbanking"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                  onClick={() => setPaymentMethod("netbanking")}
                >
                  <RadioGroupItem value="netbanking" id="netbanking" />
                  <Label
                    htmlFor="netbanking"
                    className="flex items-center gap-2 cursor-pointer flex-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm text-gray-900">Net Banking</span>
                  </Label>
                </div>
              </RadioGroup>

              {/* UPI Form */}
              {paymentMethod === "upi" && (
                <div className="space-y-2 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">Enter UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      disabled={processing}
                    />
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                    <p className="text-xs text-blue-900">
                      For demo: Enter any UPI ID (e.g., demo@paytm)
                    </p>
                  </div>
                </div>
              )}

              {/* Card Form */}
              {paymentMethod === "card" && (
                <div className="space-y-2 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const formatted = formatCardNumber(
                          e.target.value.replace(/\D/g, "").substring(0, 16)
                        );
                        setCardNumber(formatted);
                      }}
                      disabled={processing}
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="12/25"
                        value={cardExpiry}
                        onChange={(e) => {
                          const formatted = formatExpiry(e.target.value);
                          setCardExpiry(formatted);
                        }}
                        disabled={processing}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        placeholder="123"
                        type="password"
                        value={cardCvv}
                        onChange={(e) =>
                          setCardCvv(
                            e.target.value.replace(/\D/g, "").substring(0, 3)
                          )
                        }
                        disabled={processing}
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      disabled={processing}
                    />
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                    <p className="text-xs text-blue-900">
                      For demo: Enter any card details (e.g., 4111 1111 1111
                      1111)
                    </p>
                  </div>
                </div>
              )}

              {/* Net Banking Form */}
              {paymentMethod === "netbanking" && (
                <div className="space-y-2 pt-2">
                  <div className="space-y-2">
                    <Label>Select Your Bank</Label>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {banks.map((bank) => (
                        <div
                          key={bank}
                          className={`p-3 border-2 rounded cursor-pointer transition-all ${
                            selectedBank === bank
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedBank(bank)}
                        >
                          <p className="text-sm font-medium">{bank}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="px-4 pb-3">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg p-2 border border-gray-200">
                <Shield className="h-3 w-3 text-green-600" />
                <Lock className="h-3 w-3 text-green-600" />
                <span className="font-medium">Secure payment powered by Razorpay (Demo Mode)</span>
              </div>
            </div>

            {/* Pay Button */}
            <div className="p-4 pt-0">
              <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${amount.toLocaleString()}`
                )}
              </Button>
            </div>
          </>
        ) : (
          // Success State
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">
                Payment Successful!
              </h3>
              <p className="text-sm text-muted-foreground">
                ₹{amount.toLocaleString()} paid via{" "}
                {paymentMethod.toUpperCase()}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-medium">
                  TXN-
                  {Math.random().toString(36).substring(2, 10).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
});

RazorpayPaymentModal.displayName = "RazorpayPaymentModal";

export { RazorpayPaymentModal };
