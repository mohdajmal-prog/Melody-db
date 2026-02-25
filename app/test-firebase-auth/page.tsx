"use client";

import { useState, useEffect } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TestFirebaseAuth() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        { size: "normal" },
        auth
      );
    }
  }, []);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setMessage("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const fullPhoneNumber = `+91${phone}`;
      const appVerifier = (window as any).recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        appVerifier
      );

      (window as any).confirmationResult = confirmationResult;
      setStep("otp");
      setMessage(`OTP sent to ${fullPhoneNumber}`);
      
      toast.success(`OTP sent to ${fullPhoneNumber}`, {
        duration: 5000,
        position: "top-center",
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setMessage("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await (window as any).confirmationResult.confirm(otp);
      setMessage(`Success! User: ${result.user.phoneNumber}`);
      console.log("User signed in:", result.user);
      
      toast.success(`Phone verified: ${result.user.phoneNumber}`, {
        duration: 5000,
        position: "top-center",
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Firebase Phone Auth Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "phone" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="flex gap-2">
                  <div className="flex items-center justify-center bg-gray-100 px-3 rounded border">
                    <span className="text-sm font-semibold">+91</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <div id="recaptcha-container"></div>

              <Button
                onClick={handleSendOTP}
                disabled={loading || phone.length !== 10}
                className="w-full"
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Enter OTP</label>
                <Input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center tracking-widest font-mono"
                />
                <p className="text-xs text-gray-500">
                  OTP sent to +91{phone}
                </p>
              </div>

              <Button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                  setMessage("");
                }}
                className="w-full"
              >
                Back
              </Button>
            </>
          )}

          {message && (
            <div className={`p-3 rounded text-sm ${
              message.includes("Error") 
                ? "bg-red-100 text-red-800" 
                : "bg-green-100 text-green-800"
            }`}>
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
