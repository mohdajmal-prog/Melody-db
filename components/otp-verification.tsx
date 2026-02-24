'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { auth } from '@/lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'

export default function OTPVerification() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      })
    }
  }, [])

  const sendOTP = async () => {
    setLoading(true)
    try {
      const phoneNumber = phone.startsWith('+') ? phone : `+91${phone}`
      const appVerifier = (window as any).recaptchaVerifier
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      setConfirmationResult(result)
      setStep('otp')
      alert('OTP sent successfully!')
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      alert(error.message || 'Failed to send OTP')
    }
    setLoading(false)
  }

  const verifyOTP = async () => {
    if (!confirmationResult) {
      alert('Please request OTP first')
      return
    }
    
    setLoading(true)
    try {
      await confirmationResult.confirm(otp)
      alert('Phone verified successfully!')
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      alert('Invalid OTP. Please try again.')
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div id="recaptcha-container"></div>
        {step === 'phone' ? (
          <>
            <Input
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Button onClick={sendOTP} disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send OTP'}
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
            <Button onClick={verifyOTP} disabled={loading} className="w-full">
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
