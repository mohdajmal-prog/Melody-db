"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, ArrowLeft, Lock, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
      } catch (error) {
        console.error('reCAPTCHA error:', error);
      }
    }
  }, []);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    
    try {
      const existingUser = localStorage.getItem(`melody_user_${phone}`);
      if (mode === "login" && !existingUser) {
        alert("Phone number not registered. Please register first.");
        setMode("register");
        setIsLoading(false);
        return;
      }

      const phoneNumber = `+91${phone}`;
      
      // Clear and recreate verifier
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
      }
      
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved'),
      });
      
      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      alert("OTP sent successfully!");
    } catch (error: any) {
      console.error('Send OTP error:', error);
      console.error('Error code:', error.code);
      
      let errorMsg = "Failed to send OTP. ";
      if (error.code === 'auth/internal-error') {
        errorMsg += "Please enable Phone Authentication in Firebase Console: Authentication → Sign-in method → Phone.";
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMsg += "Invalid Firebase credentials. Check your Firebase configuration.";
      } else {
        errorMsg += error.message;
      }
      
      alert(errorMsg);
      
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      alert("Please request OTP first");
      return;
    }

    setIsLoading(true);
    
    try {
      await confirmationResult.confirm(otp);
      
      if (mode === "register") {
        const existingUser = localStorage.getItem(`melody_user_${phone}`);
        if (!existingUser) {
          setStep("details");
          setIsLoading(false);
          return;
        }
      }

      const userData = localStorage.getItem(`melody_user_${phone}`);
      if (userData) {
        localStorage.setItem("melody_current_user", userData);
        router.push("/customer");
      } else {
        alert("User not found. Please register.");
        setMode("register");
        setStep("phone");
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      alert("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !address) {
      alert("Please fill all fields");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const userData = {
      phone,
      name,
      address,
      roles: ["customer"],
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`melody_user_${phone}`, JSON.stringify(userData));
    localStorage.setItem("melody_current_user", JSON.stringify(userData));
    setIsLoading(false);

    alert("Registration successful! Welcome to Melody.");
    router.push("/customer");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Animated Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=7680&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/85 to-emerald-700/80" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 w-full max-w-md">
        <div id="recaptcha-container"></div>
        <Card className="shadow-2xl border border-gray-100 bg-white overflow-hidden">
          {/* Header with White Background */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-4 border-b border-gray-100">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mb-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </Button>
            </Link>

            <div className="flex flex-col items-center justify-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-2xl shadow-lg">
                <Sprout className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 tracking-tight">Melody</span>
            </div>

            <div className="text-center">
              <h1 className="text-lg font-semibold mb-1 text-gray-900">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-500 text-xs leading-relaxed">
                {mode === "login"
                  ? "Sign in to access your account"
                  : "Join us to get fresh products delivered"}
              </p>
            </div>
          </div>

          <CardContent className="space-y-4 p-5">
            {step === "phone" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center bg-gray-50 px-4 rounded-lg border border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">+91</span>
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      maxLength={10}
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, ""))
                      }
                      className="flex-1 h-11 text-base border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-lg transition-all"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading || phone.length !== 10}
                  className="w-full h-11 text-sm font-medium bg-green-600 hover:bg-green-700 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {isLoading ? "Sending..." : "Continue with Phone"}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-gray-500 font-medium">
                      Or
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 h-11 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all rounded-lg"
                  onClick={() => alert("Google login not implemented in demo")}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="font-medium text-sm">Continue with Google</span>
                </Button>

                <div className="text-center pt-1">
                  <p className="text-sm text-gray-600">
                    {mode === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      onClick={() =>
                        setMode(mode === "login" ? "register" : "login")
                      }
                      className="ml-1.5 text-green-600 font-semibold hover:text-green-700 hover:underline transition-all"
                    >
                      {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>
              </div>
            )}

            {step === "otp" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium text-gray-700">Verification Code</Label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                      <Lock className="h-5 w-5 text-gray-600" />
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="flex-1 text-center text-lg tracking-[0.5em] border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-lg transition-all font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Code sent to +91 {phone}
                    <button
                      onClick={() => setStep("phone")}
                      className="ml-2 text-green-600 font-medium hover:underline"
                    >
                      Change
                    </button>
                  </p>
                </div>

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 transition-all rounded-lg"
                  size="lg"
                >
                  {isLoading ? "Verifying..." : "Verify & Continue"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleSendOTP}
                  className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  size="sm"
                >
                  Resend Code
                </Button>
              </>
            )}

            {step === "details" && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">Delivery Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="House no, Street, Area, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-11 border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all rounded-lg"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 transition-all rounded-lg"
                  size="lg"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </>
            )}

            {step === "roles" && (
              <>
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1.5">
                      Choose Your Roles
                    </h3>
                    <p className="text-sm text-gray-500">
                      Select services you want to access
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRoles.includes("student")
                          ? "border-blue-500 bg-blue-50/50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleRole("student")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center">
                          {selectedRoles.includes("student") && (
                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Student Services</p>
                          <p className="text-sm text-muted-foreground">
                            Part-time work, tuition, IT support, design
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRoles.includes("worker")
                          ? "border-orange-500 bg-orange-50/50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleRole("worker")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center">
                          {selectedRoles.includes("worker") && (
                            <div className="w-3 h-3 bg-orange-500 rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Worker Services</p>
                          <p className="text-sm text-muted-foreground">
                            Daily-wage jobs, construction, plumbing, cleaning
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedRoles.includes("employer")
                          ? "border-green-500 bg-green-50/50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => toggleRole("employer")}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 rounded flex items-center justify-center">
                          {selectedRoles.includes("employer") && (
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">Employer Services</p>
                          <p className="text-sm text-muted-foreground">
                            Hire students and workers, manage assignments
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCompleteRegistration}
                  disabled={isLoading || selectedRoles.length === 0}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 transition-all rounded-lg"
                  size="lg"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isLoading ? "Creating Account..." : "Complete Registration"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => setStep("details")}
                  className="w-full"
                  size="sm"
                >
                  Back
                </Button>
              </>
            )}

            <div className="flex items-center justify-center gap-2 pt-3 border-t border-gray-100">
              <ShieldCheck className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">
                Secure & Encrypted
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
