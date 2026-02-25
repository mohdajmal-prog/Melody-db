"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, ArrowLeft, ShieldCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from "firebase/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !auth.app) {
      return;
    }
    
    if (typeof window !== 'undefined') {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
      }
      
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'normal',
          callback: (response: any) => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            toast.error('reCAPTCHA expired. Please try again.');
          }
        });
        (window as any).recaptchaVerifier.render();
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
      }
    }
    
    return () => {
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
        } catch (e) {}
      }
    };
  }, []);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    
    const existingUser = localStorage.getItem(`melody_user_${phone}`);
    
    if (mode === "login" && !existingUser) {
      alert("Phone number not registered. Please register first.");
      setMode("register");
      setIsLoading(false);
      return;
    }
    
    try {
      const phoneNumber = `+91${phone}`;
      const appVerifier = (window as any).recaptchaVerifier;
      
      if (!appVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }
      
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep("otp");
      
      toast.success('OTP sent successfully!', {
        duration: 5000,
        position: "top-center",
      });
    } catch (error: any) {
      console.error('Send OTP error:', error);
      toast.error(error.message || 'Failed to send OTP', {
        duration: 5000,
        position: "top-center",
      });
      
      if ((window as any).recaptchaVerifier) {
        try {
          (window as any).recaptchaVerifier.clear();
          (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'normal',
          });
          (window as any).recaptchaVerifier.render();
        } catch (e) {}
      }
    }
    
    setIsLoading(false);
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
      
      toast.success('Phone verified successfully!');
      
      if (mode === "login") {
        const userData = localStorage.getItem(`melody_user_${phone}`);
        if (userData) {
          localStorage.setItem("melody_current_user", userData);
          router.push("/customer");
        }
      } else {
        setStep("details");
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      toast.error('Invalid OTP. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleContinue = async () => {
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const existingUser = localStorage.getItem(`melody_user_${phone}`);
    
    if (mode === "login") {
      if (!existingUser) {
        alert("Phone number not registered. Please register first.");
        setMode("register");
        setIsLoading(false);
        return;
      }
      localStorage.setItem("melody_current_user", existingUser);
      router.push("/customer");
    } else {
      if (existingUser) {
        alert("Phone number already registered. Please login.");
        setMode("login");
        setIsLoading(false);
        return;
      }
      setStep("details");
    }
    
    setIsLoading(false);
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
          backgroundImage: "url('https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=7680&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-700/50" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

      <div className="relative z-10 w-full max-w-[280px]">
        {step === "phone" && (
          <div className="mb-4 flex justify-center">
            <div id="recaptcha-container"></div>
          </div>
        )}

        <Card className="shadow-2xl border border-gray-100 bg-white overflow-hidden">
          {/* Header with White Background */}
          <div className="bg-gradient-to-b from-gray-50 to-white p-2 border-b border-gray-100">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mb-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </Button>
            </Link>

            <div className="flex flex-col items-center justify-center gap-1 mb-1.5">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-1 rounded-lg shadow-lg">
                <Sprout className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-semibold text-gray-900 tracking-tight">Melody</span>
            </div>

            <div className="text-center">
              <h1 className="text-sm font-semibold mb-0 text-gray-900">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </h1>
              <p className="text-gray-500 text-[10px] leading-relaxed">
                {mode === "login"
                  ? "Sign in to access your account"
                  : "Join us to get fresh products delivered"}
              </p>
            </div>
          </div>

          <CardContent className="space-y-2.5 p-3">
            {step === "phone" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-medium text-gray-700">Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="flex items-center justify-center bg-gray-50 px-2.5 rounded-lg border border-gray-200">
                      <span className="text-xs font-semibold text-gray-700">+91</span>
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
                      className="flex-1 h-9 text-sm border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-lg transition-all"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSendOTP}
                  disabled={isLoading || phone.length !== 10}
                  className="w-full h-9 text-xs font-medium bg-green-600 hover:bg-green-700 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>

                <div className="relative my-2">
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
                  className="w-full gap-2 h-9 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all rounded-lg"
                  onClick={() => alert("Google login not implemented in demo")}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                  <span className="font-medium text-xs">Continue with Google</span>
                </Button>

                <div className="text-center pt-0">
                  <p className="text-xs text-gray-600">
                    {mode === "login"
                      ? "Don't have an account?"
                      : "Already have an account?"}
                    <button
                      onClick={() =>
                        setMode(mode === "login" ? "register" : "login")
                      }
                      className="ml-1 text-green-600 font-semibold hover:text-green-700 hover:underline transition-all"
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
                  <Label htmlFor="otp" className="text-xs font-medium text-gray-700">Enter OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="h-9 text-center text-base tracking-widest border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 rounded-lg transition-all font-mono"
                  />
                  <p className="text-[10px] text-gray-500">
                    OTP sent to {`+91${phone}`}
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
                  className="w-full h-9 bg-green-600 hover:bg-green-700 transition-all rounded-lg text-xs"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                    setGeneratedOtp(newOtp);
                    const fullPhoneNumber = `+91${phone}`;
                    
                    const welcomeMessage = mode === "login" 
                      ? "Welcome Back! 👋" 
                      : "Welcome to Melody! 🌱";
                    
                    toast(
                      <div className="flex flex-col gap-0 text-[13px] leading-tight">
                        <div className="font-semibold text-gray-900 mb-1">Melody</div>
                        <div className="text-gray-700">
                          Your OTP is <span className="font-bold text-gray-900">{newOtp}</span>. Valid for 10 minutes. Do not share this code with anyone.
                        </div>
                        <div className="text-[11px] text-gray-500 mt-1.5 pt-1.5 border-t border-gray-200">
                          {fullPhoneNumber} • {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>,
                      {
                        duration: 10000,
                        position: "top-center" as const,
                        style: {
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          maxWidth: '280px',
                          marginTop: '20px',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          left: '50%',
                          transform: 'translateX(-50%)',
                        },
                      }
                    );
                  }}
                  className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  size="sm"
                >
                  Resend OTP
                </Button>
              </>
            )}

            {step === "details" && (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-medium text-gray-700">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-9 border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all rounded-lg text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs font-medium text-gray-700">Delivery Address</Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="House no, Street, Area, City"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-9 border border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-all rounded-lg text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full h-9 bg-green-600 hover:bg-green-700 transition-all rounded-lg text-xs"
                  size="lg"
                >
                  <UserPlus className="h-3 w-3 mr-1.5" />
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </>
            )}

            {step === "unused" && (
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

            <div className="flex items-center justify-center gap-1.5 pt-1.5 border-t border-gray-100">
              <ShieldCheck className="h-3 w-3 text-gray-400" />
              <span className="text-[10px] text-gray-500 font-medium">
                Secure & Encrypted
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
