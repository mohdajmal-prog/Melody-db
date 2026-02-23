import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !verifySid) {
      return NextResponse.json({ error: 'Twilio configuration missing' }, { status: 500 });
    }

    const response = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/VerificationCheck`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: `+91${phone}`,
        Code: otp,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio verification error:', error);
      return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }

    const data = await response.json();
    
    if (data.status === 'approved') {
      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json({ success: false, verified: false, error: 'Invalid OTP' }, { status: 400 });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}