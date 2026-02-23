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
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, GraduationCap, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentRegisterPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    mobileNumber: "",
    institution: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("melody_current_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      // Pre-fill with existing data if available
      setFormData({
        fullName: parsed.name || "",
        age: "",
        mobileNumber: parsed.phone || "",
        institution: "",
      });
    } else {
      router.push("/auth");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.age ||
      !formData.mobileNumber ||
      !formData.institution
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Save student profile data
    const studentProfile = {
      ...formData,
      phone: user.phone,
      email: user.email,
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "student_registration_profile",
      JSON.stringify(studentProfile)
    );

    // Update user roles to include student
    const updatedUser = {
      ...user,
      roles: [...(user.roles || []), "student"],
    };
    localStorage.setItem("melody_current_user", JSON.stringify(updatedUser));

    setShowSuccess(true);
    toast({
      title: "Registration Successful",
      description: "Your student profile has been created.",
    });

    setTimeout(() => {
      router.push("/customer/settings/services/student");
    }, 1500);
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-green-500/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Registration Complete!
              </h2>
              <p className="text-muted-foreground">
                Redirecting you to select your service categories...
              </p>
            </div>
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
            <Link href="/customer/settings">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Student Registration
              </h1>
              <p className="text-sm text-muted-foreground">
                Complete your profile to become a student service provider
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>
              Fill in your details to get started with student services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, age: e.target.value }))
                  }
                  required
                  min="16"
                  max="30"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.mobileNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      mobileNumber: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">
                  Institution / College Name *
                </Label>
                <Input
                  id="institution"
                  type="text"
                  placeholder="Enter your college or institution name"
                  value={formData.institution}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      institution: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Complete Registration
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
