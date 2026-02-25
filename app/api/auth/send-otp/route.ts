import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;

    if (!authKey || !templateId) {
      return NextResponse.json({ error: 'MSG91 configuration missing' }, { status: 500 });
    }

    const response = await fetch(`https://control.msg91.com/api/v5/otp`, {
      method: 'POST',
      headers: {
        'authkey': authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: templateId,
        mobile: `91${phone}`,
        otp_length: 6,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('MSG91 error:', error);
      return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ success: true, type: data.type });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}