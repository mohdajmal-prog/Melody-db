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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  GraduationCap,
  Keyboard,
  BookOpen,
  Users,
  Monitor,
  Palette,
  Plus,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const studentServiceCategories = [
  {
    id: "data-entry",
    name: "Data Entry",
    icon: Keyboard,
    description: "Online data entry and administrative tasks",
  },
  {
    id: "tuition",
    name: "Tuition & Teaching",
    icon: BookOpen,
    description: "Home tuition and online teaching assistance",
  },
  {
    id: "event-helpers",
    name: "Event Helpers",
    icon: Users,
    description: "Event setup, coordination, and assistance",
  },
  {
    id: "it-support",
    name: "IT Support",
    icon: Monitor,
    description: "Basic computer troubleshooting and support",
  },
  {
    id: "design",
    name: "Design & Graphics",
    icon: Palette,
    description: "Graphic design, social media content creation",
  },
  {
    id: "other",
    name: "Other Skills",
    icon: Plus,
    description: "Any other skills you can offer",
  },
];

export default function StudentServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [profileForm, setProfileForm] = useState({
    skills: "",
    experience: "",
    availability: "",
    hourlyRate: "",
    description: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("melody_current_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);

      // Check if user has completed student registration
      const studentProfile = localStorage.getItem(
        "student_registration_profile"
      );
      if (!studentProfile) {
        router.push("/customer/settings/services/student/register");
        return;
      }

      const storedProfiles = JSON.parse(
        localStorage.getItem("melody_services_students") || "[]"
      );
      setProfiles(storedProfiles);

      // If student has an existing profile, populate form
      const my = storedProfiles.find((p: any) => p.phone === parsed.phone);
      if (my) {
        setProfileForm((prev) => ({
          ...prev,
          skills: my.skills || prev.skills,
          experience: my.experience || prev.experience,
          availability: my.availability || prev.availability,
          hourlyRate: my.hourlyRate || prev.hourlyRate,
          description: my.description || prev.description,
        }));
        setSelectedCategories(my.categories || []);
      }
    } else {
      router.push("/auth");
    }
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = () => {
    // Save profile data to localStorage array for global discovery
    const profileData = {
      id: `${user.phone}_${Date.now()}`,
      phone: user.phone,
      name: user.name,
      categories: selectedCategories,
      ...profileForm,
      role: "student",
      blocked: false,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(
      localStorage.getItem("melody_services_students") || "[]"
    );
    const filtered = existing.filter((p: any) => p.phone !== user.phone);
    const updated = [...filtered, profileData];
    localStorage.setItem("melody_services_students", JSON.stringify(updated));

    // Keep backwards compatibility with single-key used in other places
    localStorage.setItem(
      "student_service_profile",
      JSON.stringify(profileData)
    );

    setProfiles(updated);
    setShowSuccess(true);
    toast({
      title: "Profile created",
      description: "Your student profile is live.",
    });
    setTimeout(() => {
      router.push("/customer/settings/services");
    }, 1200);
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
              <h2 className="text-2xl font-bold mb-2">Profile Created!</h2>
              <p className="text-muted-foreground">
                Your student services profile has been submitted for approval.
              </p>
            </div>
            <Button onClick={() => router.push("/customer/settings/services")}>
              Back to Services
            </Button>
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
                <GraduationCap className="h-5 w-5 text-primary" />
                Student Services
              </h1>
              <p className="text-sm text-muted-foreground">
                Create your profile for part-time work opportunities
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Service Categories</CardTitle>
              <CardDescription>
                Choose the types of work you're interested in offering
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {studentServiceCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedCategories.includes(category.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryToggle(category.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <category.icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Profile Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create Your Profile</CardTitle>
              <CardDescription>
                Fill in your details to start offering services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Expertise</Label>
                <Textarea
                  id="skills"
                  placeholder="List your skills, e.g., Microsoft Office, Photoshop, Teaching experience..."
                  value={profileForm.skills}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      skills: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience</Label>
                <Textarea
                  id="experience"
                  placeholder="Describe your relevant experience..."
                  value={profileForm.experience}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  placeholder="e.g., Weekends, Evenings, Full-time"
                  value={profileForm.availability}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      availability: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  placeholder="e.g., 200"
                  value={profileForm.hourlyRate}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      hourlyRate: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Additional Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell employers about yourself..."
                  value={profileForm.description}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={selectedCategories.length === 0}
              >
                Create Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Employer and Admin views */}
        {(user?.roles?.includes("employer") ||
          user?.roles?.includes("admin")) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Student Profiles</CardTitle>
              <CardDescription>
                View student profiles and assign tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profiles.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No student profiles found
                </p>
              )}
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="p-3 border rounded-md flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {p.name || p.phone}{" "}
                      {p.blocked && (
                        <span className="text-sm text-red-600">(Blocked)</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(p.categories || []).join(", ")} • {p.availability}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const details = prompt("Enter assignment details:");
                        if (!details) return;
                        const assignments = JSON.parse(
                          localStorage.getItem("melody_service_assignments") ||
                            "[]"
                        );
                        assignments.push({
                          id: `${p.id}_${Date.now()}`,
                          profileId: p.id,
                          studentPhone: p.phone,
                          employerPhone: user.phone,
                          details,
                          status: "assigned",
                          createdAt: new Date().toISOString(),
                        });
                        localStorage.setItem(
                          "melody_service_assignments",
                          JSON.stringify(assignments)
                        );
                        alert("Assigned");
                      }}
                    >
                      Assign
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const updated = profiles.map((x: any) =>
                          x.id === p.id ? { ...x, blocked: !x.blocked } : x
                        );
                        localStorage.setItem(
                          "melody_services_students",
                          JSON.stringify(updated)
                        );
                        setProfiles(updated);
                      }}
                    >
                      {p.blocked ? "Unblock" : "Block"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
