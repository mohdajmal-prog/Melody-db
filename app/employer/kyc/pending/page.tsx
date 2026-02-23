"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle, Home } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployerKYCPending() {
  const router = useRouter();
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const checkApproval = () => {
      const userData = localStorage.getItem('melody_current_user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user.employerStatus === 'approved' || user.roles?.includes('employer')) {
          setIsApproved(true);
          router.push('/employer');
        }
      }
    };
    
    checkApproval();
    const interval = setInterval(checkApproval, 2000);
    return () => clearInterval(interval);
  }, [router]);

  if (isApproved) return null;
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        <Card className="border-2 border-yellow-500/30">
          <CardHeader className="text-center pb-3">
            <div className="w-20 h-20 mx-auto mb-4 bg-yellow-500/10 rounded-full flex items-center justify-center">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">
              Employer KYC Under Review
            </CardTitle>
            <CardDescription>
              Your application is being verified by our admin team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Documents Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    All required documents uploaded successfully
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    Admin Verification Pending
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Usually takes 24-48 hours
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    What happens next?
                  </p>
                  <ul className="text-xs text-blue-800 mt-2 space-y-1">
                    <li>• Admin will verify all your documents</li>
                    <li>• You'll receive SMS/notification once approved</li>
                    <li>• After approval, you can access employer features</li>
                    <li>• We'll call you for any clarifications needed</li>
                  </ul>
                </div>
              </div>
            </div>

            <Link href="/">
              <Button
                className="w-full bg-transparent"
                size="lg"
                variant="outline"
              >
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>

        {!isApproved && (
          <Card className="bg-accent/10 border-accent/30">
            <CardContent className="p-4">
              <p className="text-sm text-center text-accent-foreground">
                <strong>Demo Mode:</strong>{" "}
                <Link href="/admin" className="underline">
                  Login as Admin
                </Link>{" "}
                to approve KYC and continue demo
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
