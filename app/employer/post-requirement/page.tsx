"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, MapPin, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const requirementSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Please provide more details"),
  date: z.string().refine((d) => Boolean(Date.parse(d)), "Valid date required"),
  time: z.string().min(4, "Time required"),
  durationHours: z.number().min(1, "Duration minimum 1 hour"),
  staffCount: z.number().min(1, "At least 1 staff required"),
  location: z.string().min(3, "Location required"),
  contact: z.string().min(6, "Contact required"),
});

type RequirementForm = z.infer<typeof requirementSchema>;

export default function PostRequirementPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RequirementForm>({ resolver: zodResolver(requirementSchema) });

  useEffect(() => {
    const u = localStorage.getItem("melody_current_user");
    if (!u) return router.push("/auth");
    const parsed = JSON.parse(u);
    if (!parsed.roles?.includes("employer"))
      return router.push("/customer/settings/services");
    setUser(parsed);
    if (parsed.phone) setValue("contact", parsed.phone);
  }, [router, setValue]);

  const onSubmit = (data: RequirementForm) => {
    if (!user) return;
    const requirements = JSON.parse(
      localStorage.getItem("melody_requirements") || "[]"
    );
    const newReq = {
      id: `req_${Date.now()}`,
      ...data,
      durationHours: Number(data.durationHours),
      staffCount: Number(data.staffCount),
      posterPhone: user.phone,
      posterName: user.name,
      createdAt: new Date().toISOString(),
      status: "open",
    };
    requirements.push(newReq);
    localStorage.setItem("melody_requirements", JSON.stringify(requirements));
    setSuccess(true);
    setTimeout(() => router.push("/employer/my-requirements"), 900);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Requirement Posted</h2>
            <p className="text-muted-foreground">
              Your requirement has been posted and is visible in My
              Requirements.
            </p>
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
            <h1 className="text-2xl font-bold">Post Requirement</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>New Requirement</CardTitle>
                <CardDescription>
                  Post an event requirement for catering & staff
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...register("title")} />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input id="date" type="date" {...register("date")} />
                  {errors.date && (
                    <p className="text-sm text-red-600">
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input id="time" type="time" {...register("time")} />
                  {errors.time && (
                    <p className="text-sm text-red-600">
                      {errors.time.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="durationHours">Duration (hrs) *</Label>
                  <Input
                    id="durationHours"
                    type="number"
                    {...register("durationHours", { valueAsNumber: true })}
                  />
                  {errors.durationHours && (
                    <p className="text-sm text-red-600">
                      {errors.durationHours.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staffCount">Staff Count *</Label>
                  <Input
                    id="staffCount"
                    type="number"
                    {...register("staffCount", { valueAsNumber: true })}
                  />
                  {errors.staffCount && (
                    <p className="text-sm text-red-600">
                      {errors.staffCount.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" {...register("location")} />
                {errors.location && (
                  <p className="text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Contact *</Label>
                <Input id="contact" {...register("contact")} />
                {errors.contact && (
                  <p className="text-sm text-red-600">
                    {errors.contact.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Post Requirement
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
