"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Trash2, Edit2 } from "lucide-react";

export default function MyRequirementsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [requirements, setRequirements] = useState<any[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("melody_current_user");
    if (!u) return router.push("/auth");
    const parsed = JSON.parse(u);
    if (!parsed.roles?.includes("employer"))
      return router.push("/customer/settings/services");
    setUser(parsed);

    const all = JSON.parse(localStorage.getItem("melody_requirements") || "[]");
    setRequirements(all.filter((r: any) => r.posterPhone === parsed.phone));
  }, [router]);

  const cancelRequirement = (id: string) => {
    const all = JSON.parse(localStorage.getItem("melody_requirements") || "[]");
    const updated = all.map((r: any) =>
      r.id === id ? { ...r, status: "cancelled" } : r
    );
    localStorage.setItem("melody_requirements", JSON.stringify(updated));
    setRequirements(updated.filter((r: any) => r.posterPhone === user.phone));
  };

  const removeRequirement = (id: string) => {
    const all = JSON.parse(localStorage.getItem("melody_requirements") || "[]");
    const updated = all.filter((r: any) => r.id !== id);
    localStorage.setItem("melody_requirements", JSON.stringify(updated));
    setRequirements(updated.filter((r: any) => r.posterPhone === user.phone));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">My Requirements</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-3xl space-y-4">
        {requirements.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                No requirements posted yet
              </p>
              <div className="mt-4">
                <Button
                  onClick={() => router.push("/employer/post-requirement")}
                >
                  Post a Requirement
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {requirements.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{r.title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {r.date} • {r.time} • {r.staffCount} staff
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {r.status === "open" ? (
                    <Button
                      variant="outline"
                      onClick={() => cancelRequirement(r.id)}
                    >
                      Cancel
                    </Button>
                  ) : (
                    <div className="text-sm text-red-600">Cancelled</div>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => removeRequirement(r.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{r.description}</p>
              <p className="text-xs text-muted-foreground">
                Location: {r.location}
              </p>
              <p className="text-xs text-muted-foreground">
                Contact: {r.contact}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
