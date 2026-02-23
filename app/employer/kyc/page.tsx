"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Building2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Camera,
  FileText,
  User,
  Truck,
} from "lucide-react";

export default function EmployerKYC() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    aadhaar: "",
    pan: "",
    gst: "",
    businessName: "",
    businessType: "",
    bankAccount: "",
    ifsc: "",
    aadhaarDoc: null as File | null,
    panDoc: null as File | null,
    gstDoc: null as File | null,
    businessDoc: null as File | null,
    bankDoc: null as File | null,
    selfie: null as File | null,
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleFileUpload =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFormData({ ...formData, [field]: file });
      }
    };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate KYC submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store KYC status
    const user = JSON.parse(localStorage.getItem("melody_user") || "{}");
    localStorage.setItem(
      `melody_kyc_employer_${user.phone}`,
      JSON.stringify({ status: "pending", ...formData })
    );

    setIsSubmitting(false);
    router.push("/employer/kyc/pending");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Employer KYC Verification
                </CardTitle>
                <CardDescription>
                  Complete your profile to start hiring for All workers
                </CardDescription>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Step {step} of {totalSteps}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

        {/* Step 1: Personal & Business Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal & Business Information
              </CardTitle>
              <CardDescription>
                Enter your basic details and business information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (as per Aadhaar)</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type</Label>
                <Input
                  id="businessType"
                  placeholder="e.g., Logistics, Transportation, Event Management"
                  value={formData.businessType}
                  onChange={(e) =>
                    setFormData({ ...formData, businessType: e.target.value })
                  }
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!formData.fullName || !formData.businessName}
                className="w-full"
                size="lg"
              >
                Continue to Documents
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Identity Documents */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Identity & Business Documents
              </CardTitle>
              <CardDescription>
                Upload your personal and business documents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    placeholder="XXXX XXXX XXXX"
                    maxLength={12}
                    value={formData.aadhaar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        aadhaar: e.target.value.replace(/\D/g, ""),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Aadhaar Card (Front & Back)</Label>
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
                          <span className="font-medium">
                            {formData.aadhaarDoc.name}
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input
                    id="pan"
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={formData.pan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pan: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload PAN Card</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload("panDoc")}
                      className="hidden"
                      id="pan-upload"
                    />
                    <label htmlFor="pan-upload" className="cursor-pointer">
                      {formData.panDoc ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">
                            {formData.panDoc.name}
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number (Optional)</Label>
                  <Input
                    id="gst"
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                    value={formData.gst}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gst: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload GST Certificate (if applicable)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload("gstDoc")}
                      className="hidden"
                      id="gst-upload"
                    />
                    <label htmlFor="gst-upload" className="cursor-pointer">
                      {formData.gstDoc ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">
                            {formData.gstDoc.name}
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={
                    !formData.aadhaar ||
                    !formData.pan ||
                    !formData.aadhaarDoc ||
                    !formData.panDoc
                  }
                  className="flex-1"
                  size="lg"
                >
                  Continue to Business Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Business Documents & Bank Details */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Business Documents & Bank Details
              </CardTitle>
              <CardDescription>
                Upload business registration and bank details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Business Registration/License</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload("businessDoc")}
                    className="hidden"
                    id="business-upload"
                  />
                  <label htmlFor="business-upload" className="cursor-pointer">
                    {formData.businessDoc ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <CheckCircle2 className="h-5 w-5" />
                        <span className="font-medium">
                          {formData.businessDoc.name}
                        </span>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bankAccount">Bank Account Number</Label>
                  <Input
                    id="bankAccount"
                    placeholder="Enter account number"
                    value={formData.bankAccount}
                    onChange={(e) =>
                      setFormData({ ...formData, bankAccount: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input
                    id="ifsc"
                    placeholder="SBIN0001234"
                    maxLength={11}
                    value={formData.ifsc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ifsc: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Bank Statement / Cancelled Cheque</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload("bankDoc")}
                      className="hidden"
                      id="bank-upload"
                    />
                    <label htmlFor="bank-upload" className="cursor-pointer">
                      {formData.bankDoc ? (
                        <div className="flex items-center justify-center gap-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">
                            {formData.bankDoc.name}
                          </span>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Secure Payment Processing
                    </p>
                    <p className="text-xs text-blue-800 mt-1">
                      Your payments for driver services will be processed
                      securely through this account
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={
                    !formData.businessDoc ||
                    !formData.bankAccount ||
                    !formData.ifsc ||
                    !formData.bankDoc
                  }
                  className="flex-1"
                  size="lg"
                >
                  Continue to Verification
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Selfie Verification */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Selfie Verification
              </CardTitle>
              <CardDescription>
                Upload a clear selfie holding your Aadhaar card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Upload Selfie with Aadhaar</Label>
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
                        <p className="font-medium text-green-700">
                          {formData.selfie.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Selfie uploaded successfully
                        </p>
                      </div>
                    ) : (
                      <>
                        <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm font-medium mb-2">
                          Click to upload selfie
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Make sure your face and Aadhaar are clearly visible
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Verification Guidelines
                    </p>
                    <ul className="text-xs text-yellow-800 mt-2 space-y-1">
                      <li>• Hold your Aadhaar card near your face</li>
                      <li>• Ensure good lighting and clear image</li>
                      <li>• Face must be clearly visible</li>
                      <li>• Aadhaar details should be readable</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(3)}
                  variant="outline"
                  className="flex-1 bg-transparent"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.selfie || isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90"
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
  );
}
