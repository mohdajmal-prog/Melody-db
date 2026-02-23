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
  User,
  MapPin,
  Phone,
  Sprout,
  TruckIcon,
  ChevronRight,
  ShieldCheck,
  Wallet,
  Bell,
  LogOut,
  Briefcase,
  Calendar,
  GraduationCap,
  HardHat,
  Settings,
  Sparkles,
  Zap,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("melody_current_user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("melody_current_user");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const hasFarmerRole = user.roles?.includes("farmer");
  const hasDriverRole = user.roles?.includes("driver");
  const hasEmployerRole = user.roles?.includes("employer");
  const hasStudentRole = user.roles?.includes("student");
  const hasWorkerRole = user.roles?.includes("worker");
  const farmerPending = user.farmerStatus === "pending";
  const driverPending = user.driverStatus === "pending";
  const employerPending = user.employerStatus === "pending";

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-primary/90 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-white">Settings & Profile</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Profile Card */}
        <Card className="mb-6 bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white pb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                <User className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2 text-base">
                  <Phone className="h-4 w-4" />
                  +91 {user.phone}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start gap-3 text-sm bg-gray-50 p-3 rounded-lg">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{user.address}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.roles?.map((role: string) => (
                <Badge key={role} variant="secondary" className="capitalize px-3 py-1 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
                  {role}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  Unlock New Opportunities
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Expand your role and start earning today
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {/* Become a Farmer */}
            <Link
              href={
                hasFarmerRole
                  ? "/farmer"
                  : farmerPending
                  ? "/farmer/kyc/pending"
                  : "/farmer/kyc"
              }
            >
              <Card className="group hover:shadow-2xl hover:scale-[1.02] hover:border-green-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-green-50/30 border-2 border-gray-200">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Sprout className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-green-600 transition-colors">Become a Farmer</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hasFarmerRole
                          ? "Farmer dashboard active"
                          : farmerPending
                          ? "KYC pending approval"
                          : "Sell your products directly"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasFarmerRole && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1">✓ Active</Badge>
                    )}
                    {farmerPending && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 px-3 py-1">⏳ Pending</Badge>
                    )}
                    <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Become a Driver */}
            <Link
              href={
                hasDriverRole
                  ? "/driver"
                  : driverPending
                  ? "/driver/kyc/pending"
                  : "/driver/kyc"
              }
            >
              <Card className="group hover:shadow-2xl hover:scale-[1.02] hover:border-blue-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-blue-50/30 border-2 border-gray-200">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <TruckIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-blue-600 transition-colors">Become a Driver</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hasDriverRole
                          ? "Driver dashboard active"
                          : driverPending
                          ? "KYC pending approval"
                          : "Earn by delivering orders"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasDriverRole && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1">✓ Active</Badge>
                    )}
                    {driverPending && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 px-3 py-1">⏳ Pending</Badge>
                    )}
                    <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Become an Employer */}
            <Link
              href={
                hasEmployerRole
                  ? "/employer"
                  : employerPending
                  ? "/employer/kyc/pending"
                  : "/employer/kyc"
              }
            >
              <Card className="group hover:shadow-2xl hover:scale-[1.02] hover:border-purple-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-purple-50/30 border-2 border-gray-200">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Briefcase className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-purple-600 transition-colors">Become an Employer</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hasEmployerRole
                          ? "Employer dashboard active"
                          : employerPending
                          ? "KYC pending approval"
                          : "Hire All types of workers"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasEmployerRole && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1">✓ Active</Badge>
                    )}
                    {employerPending && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 px-3 py-1">⏳ Pending</Badge>
                    )}
                    <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Become a Student */}
            <Link
              href={
                hasStudentRole
                  ? "/customer/settings/services"
                  : "/customer/settings/services/student/register"
              }
            >
              <Card className="group hover:shadow-2xl hover:scale-[1.02] hover:border-amber-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-amber-50/30 border-2 border-gray-200">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <GraduationCap className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-amber-600 transition-colors">Become a Student</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hasStudentRole
                          ? "Student services active"
                          : "Offer part-time work and earn"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasStudentRole && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1">✓ Active</Badge>
                    )}
                    <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Become a Worker */}
            <Link href="/customer/settings/services">
              <Card className="group hover:shadow-2xl hover:scale-[1.02] hover:border-orange-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-orange-50/30 border-2 border-gray-200">
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <HardHat className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-lg group-hover:text-orange-600 transition-colors">Become a Worker</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hasWorkerRole
                          ? "Worker services active"
                          : "Find daily-wage jobs and earn"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasWorkerRole && (
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1">✓ Active</Badge>
                    )}
                    <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>

        {/* Other Settings */}
        <Card className="mb-6 bg-white border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white">
            <CardTitle className="text-xl">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/customer/subscriptions">
              <Card className="hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer bg-white border-2 border-gray-100">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center shadow-md">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">My Plans</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/customer/wallet">
              <Card className="hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer bg-white border-2 border-gray-100">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md">
                      <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">Wallet & Payments</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/customer/notifications">
              <Card className="hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer bg-white border-2 border-gray-100">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-md">
                      <Bell className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">Notifications</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/admin">
              <Card className="hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer border-2 border-primary/40 bg-gradient-to-r from-primary/5 to-transparent">
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-md">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">Admin Panel</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full shadow-lg hover:shadow-xl transition-all"
          size="lg"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
