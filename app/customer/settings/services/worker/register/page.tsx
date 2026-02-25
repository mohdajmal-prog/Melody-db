"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, HardHat, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const workerRegistrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  age: z
    .number()
    .min(18, "Must be at least 18 years old")
    .max(65, "Must be 65 or younger"),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),
  aadharNumber: z.string().regex(/^\d{12}$/, "Aadhar number must be 12 digits"),
});

type WorkerRegistrationForm = z.infer<typeof workerRegistrationSchema>;

export default function WorkerRegistrationPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WorkerRegistrationForm>({
    resolver: zodResolver(workerRegistrationSchema),
  });

  useEffect(() => {
    const userData = localStorage.getItem("melody_current_user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      // Pre-fill form with existing user data
      if (parsedUser.name) setValue("fullName", parsedUser.name);
      if (parsedUser.phone) setValue("mobileNumber", parsedUser.phone);
    } else {
      router.push("/auth");
    }
  }, [setValue, router]);

  const onSubmit = async (data: WorkerRegistrationForm) => {
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Save registration data
      const registrationData = {
        ...data,
        userId: user.id,
        phone: user.phone,
        registeredAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "worker_registration_profile",
        JSON.stringify(registrationData)
      );

      // Update user roles
      const updatedUser = {
        ...user,
        roles: [...(user.roles || []), "worker"],
      };
      localStorage.setItem("melody_current_user", JSON.stringify(updatedUser));

      // Add to global workers array
      const existingWorkers = JSON.parse(
        localStorage.getItem("melody_services_workers") || "[]"
      );
      existingWorkers.push(registrationData);
      localStorage.setItem(
        "melody_services_workers",
        JSON.stringify(existingWorkers)
      );

      setShowSuccess(true);

      // Redirect after success animation
      setTimeout(() => {
        router.push("/customer/settings/services/worker");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Registration Successful!
            </h2>
            <p className="text-muted-foreground mb-4">
              Your worker profile has been created. Redirecting to categories...
            </p>
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer/settings/services">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <HardHat className="h-5 w-5 text-orange-600" />
                Worker Registration
              </h1>
              <p className="text-sm text-muted-foreground">
                Complete your profile to start receiving job opportunities
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please provide your details for verification and registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  {...register("age", { valueAsNumber: true })}
                  placeholder="Enter your age"
                  min="18"
                  max="65"
                />
                {errors.age && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.age.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  {...register("mobileNumber")}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
                {errors.mobileNumber && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.mobileNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                <Input
                  id="aadharNumber"
                  {...register("aadharNumber")}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength={12}
                />
                {errors.aadharNumber && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.aadharNumber.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
