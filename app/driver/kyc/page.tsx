"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { TruckIcon, Upload, CheckCircle2, AlertCircle, Camera, User, Car } from "lucide-react"

export default function DriverKYC() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    aadhaar: "",
    license: "",
    vehicleType: "",
    vehicleNumber: "",
    vehicleRC: "",
    aadhaarDoc: null as File | null,
    licenseDoc: null as File | null,
    rcDoc: null as File | null,
    selfie: null as File | null,
  })

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleFileUpload = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, [field]: file })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const user = JSON.parse(localStorage.getItem("melody_current_user") || "{}")
    
    try {
      const response = await fetch('/api/register/driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, phone: user.phone })
      })
      
      if (response.ok) {
        localStorage.setItem(`melody_kyc_driver_${user.phone}`, JSON.stringify({ status: "pending", ...formData }))
        router.push("/driver/kyc/pending")
      }
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <Card className="mb-6 border-2 border-accent/30">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-accent/20 p-3 rounded-xl">
                <TruckIcon className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl">Driver KYC Verification</CardTitle>
                <CardDescription>Complete verification to start delivering on Melody</CardDescription>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Step {step} of {totalSteps}
                </span>
                <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Step 1: Personal & License */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information & License
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (as per License)</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number</Label>
                <Input
                  id="aadhaar"
                  placeholder="XXXX XXXX XXXX"
                  maxLength={12}
                  value={formData.aadhaar}
                  onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value.replace(/\D/g, "") })}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Aadhaar Card</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload("aadhaarDoc")}
                    className="hidden"
                    id="aadhaar-upload"
                  />
                  <label htmlFor="aadhaar-upload" className="cursor-pointer">
                    {formData.aadhaarDoc ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">{formData.aadhaarDoc.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload Aadhaar document</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="license">Driving License Number</Label>
                  <Input
                    id="license"
                    placeholder="DL-XXXXXXXXXX"
                    value={formData.license}
                    onChange={(e) => setFormData({ ...formData, license: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Driving License</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload("licenseDoc")}
                      className="hidden"
                      id="license-upload"
                    />
                    <label htmlFor="license-upload" className="cursor-pointer">
                      {formData.licenseDoc ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">{formData.licenseDoc.name}</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Upload License document</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={
                  !formData.fullName ||
                  !formData.aadhaar ||
                  !formData.license ||
                  !formData.aadhaarDoc ||
                  !formData.licenseDoc
                }
                className="w-full"
                size="lg"
              >
                Continue to Vehicle Details
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Vehicle Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicleType">Vehicle Type</Label>
                <Input
                  id="vehicleType"
                  placeholder="e.g., Bike, Auto, Mini Truck"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Vehicle Registration Number</Label>
                <Input
                  id="vehicleNumber"
                  placeholder="TS 09 AB 1234"
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Vehicle RC (Registration Certificate)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload("rcDoc")}
                    className="hidden"
                    id="rc-upload"
                  />
                  <label htmlFor="rc-upload" className="cursor-pointer">
                    {formData.rcDoc ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">{formData.rcDoc.name}</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload RC document</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Vehicle Requirements</p>
                    <ul className="text-xs text-blue-800 mt-1 space-y-1">
                      <li>• Vehicle must be in good condition</li>
                      <li>• Valid registration and insurance required</li>
                      <li>• Suitable for transporting food products</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.vehicleType || !formData.vehicleNumber || !formData.rcDoc}
                  className="flex-1"
                  size="lg"
                >
                  Continue to Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Selfie */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Selfie Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Upload Selfie with License</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload("selfie")}
                    className="hidden"
                    id="selfie-upload"
                  />
                  <label htmlFor="selfie-upload" className="cursor-pointer">
                    {formData.selfie ? (
                      <div className="space-y-3">
                        <CheckCircle2 className="h-12 w-12 mx-auto text-green-600" />
                        <p className="font-medium text-green-700">{formData.selfie.name}</p>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-2">Click to upload selfie</p>
                        <p className="text-xs text-muted-foreground">Hold your license near your face</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1 bg-transparent">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.selfie || isSubmitting}
                  className="flex-1 bg-accent hover:bg-accent/90"
                  size="lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
