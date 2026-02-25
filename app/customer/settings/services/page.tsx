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
import {
  ArrowLeft,
  GraduationCap,
  HardHat,
  Briefcase,
  Users,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  // Check if profiles exist - must be called before any early returns
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [workerProfile, setWorkerProfile] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("melody_current_user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/auth");
    }
  }, []);

  useEffect(() => {
    const studentData = localStorage.getItem("student_service_profile");
    const workerData = localStorage.getItem("worker_service_profile");
    if (studentData) {
      setStudentProfile(JSON.parse(studentData));
    }
    if (workerData) {
      setWorkerProfile(JSON.parse(workerData));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const hasStudentRole = user.roles?.includes("student");
  const hasWorkerRole = user.roles?.includes("worker");
  const hasEmployerRole = user.roles?.includes("employer");

  const handleDeleteStudentProfile = () => {
    if (
      confirm("Are you sure you want to delete your student service profile?")
    ) {
      localStorage.removeItem("student_service_profile");
      // Also remove from global array
      const existing = JSON.parse(
        localStorage.getItem("melody_services_students") || "[]"
      );
      const filtered = existing.filter((p: any) => p.phone !== user.phone);
      localStorage.setItem(
        "melody_services_students",
        JSON.stringify(filtered)
      );
      setStudentProfile(null);
    }
  };

  const handleDeleteWorkerProfile = () => {
    if (
      confirm("Are you sure you want to delete your worker service profile?")
    ) {
      localStorage.removeItem("worker_service_profile");
      // Also remove from global array
      const existing = JSON.parse(
        localStorage.getItem("melody_services_workers") || "[]"
      );
      const filtered = existing.filter((p: any) => p.phone !== user.phone);
      localStorage.setItem("melody_services_workers", JSON.stringify(filtered));
      setWorkerProfile(null);
    }
  };

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
                <Briefcase className="h-5 w-5 text-primary" />
                Services
              </h1>
              <p className="text-sm text-muted-foreground">
                Find work opportunities or hire skilled workers
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Role-based Service Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Services */}
          {(hasStudentRole || hasEmployerRole) && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Student Services
                      {studentProfile && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Part-time and skill-based work opportunities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Data Entry & Administration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Tuition & Teaching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>IT Support & Design</span>
                  </div>
                </div>

                {studentProfile ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Profile Active - Ready to receive offers
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href="/customer/settings/services/student"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          Manage Profile
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDeleteStudentProfile}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link href="/customer/settings/services/student">
                    <Button className="w-full">Create Student Profile</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}

          {/* Worker Services */}
          {(hasWorkerRole || hasEmployerRole) && (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <HardHat className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Worker Services
                      {workerProfile && (
                        <Badge className="bg-green-500">Active</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Daily-wage jobs and skilled labor opportunities
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Construction & Plumbing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Electrical & Mechanical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Event & Cleaning Services</span>
                  </div>
                </div>

                {workerProfile ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Profile Active - Ready to receive job offers
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href="/customer/settings/services/worker"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          Manage Profile
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDeleteWorkerProfile}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Link href="/customer/settings/services/worker/register">
                    <Button className="w-full">Become a Worker</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Employer Management Section */}
        {hasEmployerRole && (
          <Card className="mt-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Employer Dashboard
              </CardTitle>
              <CardDescription>
                Manage student and worker profiles, approve services, and
                monitor assignments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>View All Profiles</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <CheckCircle2 className="h-6 w-6" />
                  <span>Approve Services</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Briefcase className="h-6 w-6" />
                  <span>Monitor Assignments</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Roles Message */}
        {!hasStudentRole && !hasWorkerRole && !hasEmployerRole && (
          <Card className="mt-8 border-2 border-yellow-500/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No Service Roles Available
              </h3>
              <p className="text-muted-foreground mb-4">
                To access services, you need to upgrade your account to Student,
                Worker, or Employer.
              </p>
              <Link href="/customer/settings">
                <Button>Go to Settings</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
