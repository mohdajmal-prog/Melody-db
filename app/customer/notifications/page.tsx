"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function NotificationsSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem("melody_current_user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);

      const key = `melody_notifications_${parsed.phone}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        try {
          const prefs = JSON.parse(stored);
          setEmail(Boolean(prefs.email));
          setSms(Boolean(prefs.sms));
          setPush(Boolean(prefs.push));
        } catch (e) {
          /* ignore */
        }
      }
    } else {
      router.push("/auth");
    }
  }, [router]);

  const save = () => {
    if (!user) return;
    const key = `melody_notifications_${user.phone}`;
    try {
      localStorage.setItem(key, JSON.stringify({ email, sms, push }));
      setSaved(true);
      toast({
        title: "Preferences saved",
        description: "Your notification preferences have been saved.",
      });
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      toast({
        title: "Save failed",
        description: "Could not save preferences. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon">
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <CardTitle>Notification Preferences</CardTitle>
            </div>
            <CardDescription>
              Choose how you'd like to receive updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-xs text-muted-foreground">
                  Receive email updates and receipts
                </p>
              </div>
              <Switch
                checked={email}
                onCheckedChange={(v) => setEmail(Boolean(v))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS</p>
                <p className="text-xs text-muted-foreground">
                  Receive important SMS alerts
                </p>
              </div>
              <Switch
                checked={sms}
                onCheckedChange={(v) => setSms(Boolean(v))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Push</p>
                <p className="text-xs text-muted-foreground">
                  Enable push notifications (browser)
                </p>
              </div>
              <Switch
                checked={push}
                onCheckedChange={(v) => setPush(Boolean(v))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={save} disabled={saved}>
                {saved ? "Saved" : "Save Preferences"}
              </Button>
              <Link href="/customer/settings">
                <Button variant="ghost">Back</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
