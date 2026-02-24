'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function OTPVerification() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number')
      return
    }
    
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    alert('Phone number submitted: +91' + phone)
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Phone Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="+91 9876543210"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          maxLength={10}
        />
        <Button onClick={handleSubmit} disabled={loading || phone.length !== 10} className="w-full">
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </CardContent>
    </Card>
  )
}