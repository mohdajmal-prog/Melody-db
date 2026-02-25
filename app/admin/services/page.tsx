"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminServicesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);

  useEffect(() => {
    const u = localStorage.getItem("melody_current_user");
    if (!u) return router.push("/auth");
    const parsed = JSON.parse(u);
    if (!parsed.roles?.includes("admin")) return router.push("/");
    setUser(parsed);
    setStudents(
      JSON.parse(localStorage.getItem("melody_services_students") || "[]")
    );
    setWorkers(
      JSON.parse(localStorage.getItem("melody_services_workers") || "[]")
    );
  }, [router]);

  const toggleStudent = (id: string) => {
    const updated = students.map((s) =>
      s.id === id ? { ...s, blocked: !s.blocked } : s
    );
    localStorage.setItem("melody_services_students", JSON.stringify(updated));
    setStudents(updated);
  };

  const toggleWorker = (id: string) => {
    const updated = workers.map((s) =>
      s.id === id ? { ...s, blocked: !s.blocked } : s
    );
    localStorage.setItem("melody_services_workers", JSON.stringify(updated));
    setWorkers(updated);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Admin — Services</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Student Profiles</CardTitle>
            <CardDescription>
              Approve, block or inspect student profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {students.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No student profiles
              </p>
            )}
            {students.map((s) => (
              <div
                key={s.id}
                className="p-3 border rounded flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {s.name || s.phone}{" "}
                    {s.blocked && (
                      <span className="text-sm text-red-600">(Blocked)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(s.categories || []).join(", ")} • {s.availability}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toggleStudent(s.id)}>
                    {s.blocked ? "Unblock" : "Block"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Worker Profiles</CardTitle>
            <CardDescription>
              Approve, block or inspect worker profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {workers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No worker profiles
              </p>
            )}
            {workers.map((s) => (
              <div
                key={s.id}
                className="p-3 border rounded flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">
                    {s.name || s.phone}{" "}
                    {s.blocked && (
                      <span className="text-sm text-red-600">(Blocked)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(s.categories || []).join(", ")} • {s.availability}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => toggleWorker(s.id)}>
                    {s.blocked ? "Unblock" : "Block"}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
