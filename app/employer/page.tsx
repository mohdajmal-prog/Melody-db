"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Briefcase, Calendar, FilePlus, User } from "lucide-react";

export default function EmployerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = localStorage.getItem("melody_current_user");
    if (!u) return router.push("/auth");
    const parsed = JSON.parse(u);
    setUser(parsed);
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const profile = user.employerProfile;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Employer Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">
                  {profile?.organization || user.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {profile?.contactPerson} • {profile?.contactNumber}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.roles?.includes("employer") ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/employer/post-requirement">
                  <Button
                    size="lg"
                    className="w-full flex items-center gap-3 justify-center"
                  >
                    <FilePlus className="h-4 w-4" /> Post Requirement
                  </Button>
                </Link>

                <Link href="/employer/my-requirements">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full flex items-center gap-3 justify-center"
                  >
                    <Calendar className="h-4 w-4" /> My Requirements
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  You are not registered as an Employer yet. Register to post
                  and schedule requirements for events, catering and staff.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Link href="/employer/kyc">
                    <Button size="lg">Become an Employer</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
