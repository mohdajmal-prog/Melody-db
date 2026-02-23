import { ShieldCheck, Video, TruckIcon, CheckCircle2, Sprout, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TrustBadgesProps {
  variant?: "horizontal" | "vertical"
  badges?: Array<"verified" | "video" | "organic" | "tracked" | "certified" | "quality">
}

export function TrustBadges({ variant = "horizontal", badges }: TrustBadgesProps) {
  const allBadges = {
    verified: {
      icon: ShieldCheck,
      label: "Verified Farmer",
      color: "bg-accent/20 text-accent-foreground border-accent/30",
    },
    video: {
      icon: Video,
      label: "Video Verified",
      color: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    },
    organic: {
      icon: Sprout,
      label: "100% Organic",
      color: "bg-green-500/10 text-green-700 border-green-500/20",
    },
    tracked: {
      icon: TruckIcon,
      label: "Live Tracking",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    certified: {
      icon: Award,
      label: "Quality Certified",
      color: "bg-secondary/10 text-secondary border-secondary/20",
    },
    quality: {
      icon: CheckCircle2,
      label: "Quality Checked",
      color: "bg-green-500/10 text-green-700 border-green-500/20",
    },
  }

  const displayBadges = badges || (Object.keys(allBadges) as Array<keyof typeof allBadges>)

  return (
    <div className={`flex ${variant === "vertical" ? "flex-col" : "flex-wrap"} gap-2`}>
      {displayBadges.map((badgeKey) => {
        const badge = allBadges[badgeKey]
        return (
          <Badge key={badgeKey} variant="outline" className={`gap-1 ${badge.color}`}>
            <badge.icon className="h-3 w-3" />
            {badge.label}
          </Badge>
        )
      })}
    </div>
  )
}
