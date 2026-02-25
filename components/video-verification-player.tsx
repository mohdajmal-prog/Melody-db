"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Download, CheckCircle2, Clock } from "lucide-react"

interface VideoVerificationPlayerProps {
  title: string
  uploadedBy: string
  uploadDate: string
  verified: boolean
  orderId?: string
  onPlay?: () => void
}

export function VideoVerificationPlayer({
  title,
  uploadedBy,
  uploadDate,
  verified,
  orderId,
  onPlay,
}: VideoVerificationPlayerProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {orderId && <p className="text-xs text-muted-foreground mt-1">Order: {orderId}</p>}
          </div>
          {verified ? (
            <Badge className="bg-green-500/10 text-green-700 border-green-500/20 gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20 gap-1">
              <Clock className="h-3 w-3" />
              Pending
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="lg"
              className="rounded-full w-16 h-16 group-hover:scale-110 transition-transform"
              onClick={onPlay}
            >
              <Play className="h-6 w-6" />
            </Button>
          </div>

          {/* Overlay Info */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
            0:45
          </div>
        </div>

        {/* Video Info */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="font-medium">{uploadedBy}</p>
            <p className="text-xs text-muted-foreground">{uploadDate}</p>
          </div>
          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
