"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Video, Clock } from "lucide-react"

interface VerificationStep {
  title: string
  status: "completed" | "in_progress" | "pending"
  timestamp?: string
  description: string
  hasVideo?: boolean
}

interface VerificationTimelineProps {
  orderId: string
  steps: VerificationStep[]
  onViewVideo?: (stepIndex: number) => void
}

export function VerificationTimeline({ orderId, steps, onViewVideo }: VerificationTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
      case "pending":
        return <Clock className="h-5 w-5 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "pending":
        return "bg-gray-300"
      default:
        return "bg-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Transparency Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">Order: {orderId}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Timeline Line */}
            {index < steps.length - 1 && (
              <div
                className={`absolute left-[10px] top-8 w-0.5 h-16 ${
                  step.status === "completed" ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            )}

            {/* Step Content */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full ${getStatusColor(step.status)} flex items-center justify-center`}
              >
                {step.status === "completed" && <CheckCircle2 className="h-4 w-4 text-white" />}
                {step.status === "in_progress" && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                {step.status === "pending" && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>

              {/* Details */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{step.title}</p>
                    {step.timestamp && <p className="text-xs text-muted-foreground">{step.timestamp}</p>}
                  </div>
                  {getStatusIcon(step.status)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                {step.hasVideo && step.status === "completed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2 bg-transparent"
                    onClick={() => onViewVideo?.(index)}
                  >
                    <Video className="h-4 w-4" />
                    View Verification Video
                  </Button>
                )}

                {step.status === "in_progress" && (
                  <Badge className="bg-blue-500/10 text-blue-700 border-blue-500/20 mt-2">In Progress...</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
