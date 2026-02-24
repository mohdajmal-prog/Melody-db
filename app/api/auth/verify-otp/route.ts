import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
    }

    const authKey = process.env.MSG91_AUTH_KEY;

    if (!authKey) {
      return NextResponse.json({ error: 'MSG91 configuration missing' }, { status: 500 });
    }

    const response = await fetch(`https://control.msg91.com/api/v5/otp/verify`, {
      method: 'POST',
      headers: {
        'authkey': authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile: `91${phone}`,
        otp: otp,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MSG91 verification error:', error);
      return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
    }

    const data = await response.json();
    
    if (data.type === 'success') {
      return NextResponse.json({ success: true, verified: true });
    } else {
      return NextResponse.json({ success: false, verified: false, error: 'Invalid OTP' }, { status: 400 });
    }

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}