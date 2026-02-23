'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Demo mode - Firebase OTP authentication is bypassed for testing

export default function OTPVerification() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)

  // Demo sendOTP - always succeeds without actually sending OTP
  const sendOTP = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      setStep('otp')
    } catch (error) {
      console.error('Error sending OTP:', error)
    }
    setLoading(false)
  }

  // Demo verifyOTP - accepts any 6-digit OTP
  const verifyOTP = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      if (otp.length === 6) {
        alert('Phone verified successfully! (Demo Mode)')
      } else {
        alert('Please enter a valid 6-digit OTP')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Verification (Demo)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'phone' ? (
          <>
            <Input
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={sendOTP} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send OTP (Demo)'}
            </Button>
          </>
        ) : (
          <>
            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <p className="text-xs text-muted-foreground text-center">
              Demo Mode - Use any 6-digit OTP
            </p>
            <Button onClick={verifyOTP} disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
