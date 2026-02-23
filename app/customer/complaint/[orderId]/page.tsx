"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertCircle, ArrowLeft, Camera, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ComplaintPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params?.orderId as string

  const [complaintType, setComplaintType] = useState("")
  const [description, setDescription] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const complaintTypes = [
    { id: "weight", label: "Weight Mismatch", description: "Product weight is less than ordered" },
    { id: "quality", label: "Quality Issue", description: "Product quality not as expected" },
    { id: "freshness", label: "Freshness Concern", description: "Product not fresh" },
    { id: "delay", label: "Delivery Delay", description: "Delivered later than promised time" },
    { id: "damage", label: "Damaged Product", description: "Product damaged during delivery" },
    { id: "other", label: "Other Issue", description: "Any other concern" },
  ]

  const handleSubmit = async () => {
    if (!complaintType || !description) {
      alert("Please select complaint type and provide description")
      return
    }

    setIsSubmitting(true)
    // Simulate complaint submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-2 border-green-500/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Complaint Registered</h2>
              <p className="text-muted-foreground">Complaint ID: CMP-{Math.floor(Math.random() * 10000)}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-left">
              <p className="text-sm font-medium text-blue-900 mb-2">What happens next?</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Admin will review within 30 minutes</li>
                <li>• Decision: Approve / Reject / Partial refund</li>
                <li>• You'll be notified via SMS</li>
                <li>• Approved refunds processed in 3-5 days</li>
              </ul>
            </div>
            <Link href="/customer">
              <Button className="w-full">Back to Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/customer">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Raise Complaint</h1>
              <p className="text-sm text-muted-foreground">Order: {orderId}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        <Card className="border-2 border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Complaint Policy</p>
                <ul className="text-xs text-yellow-800 mt-1 space-y-1">
                  <li>• Must be raised within 30 minutes of delivery</li>
                  <li>• Photo/video evidence required for weight & quality issues</li>
                  <li>• Admin decision is final</li>
                  <li>• False complaints may result in account suspension</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={complaintType} onValueChange={setComplaintType}>
              {complaintTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                >
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Describe the issue in detail *</Label>
              <Textarea
                id="description"
                placeholder="Please provide specific details about the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Photo/Video Evidence</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {photo ? (
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">{photo.name}</span>
                    </div>
                  ) : (
                    <>
                      <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload photo or video</p>
                      <p className="text-xs text-muted-foreground mt-1">Required for weight & quality issues</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !complaintType || !description}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </Button>
      </div>
    </div>
  )
}
