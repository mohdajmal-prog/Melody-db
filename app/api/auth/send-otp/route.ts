import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

    if (!accountSid || !authToken || !verifySid) {
      return NextResponse.json({ error: 'Twilio configuration missing' }, { status: 500 });
    }

    const response = await fetch(`https://verify.twilio.com/v2/Services/${verifySid}/Verifications`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: `+91${phone}`,
        Channel: 'sms',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Twilio error:', error);
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, sid: data.sid });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}