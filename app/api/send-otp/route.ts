import { NextResponse } from 'next/server';

const otpStore = new Map();

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiry (10 minutes)
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });
    
    // In production, integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`OTP for ${phone}: ${otp}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully',
      // Remove this in production - only for testing
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { phone, otp } = await request.json();
    
    const stored = otpStore.get(phone);
    
    if (!stored) {
      return NextResponse.json({ error: 'OTP not found or expired' }, { status: 400 });
    }
    
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(phone);
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }
    
    if (stored.attempts >= 3) {
      otpStore.delete(phone);
      return NextResponse.json({ error: 'Too many attempts' }, { status: 400 });
    }
    
    if (stored.otp !== otp) {
      stored.attempts++;
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }
    
    otpStore.delete(phone);
    return NextResponse.json({ success: true, message: 'OTP verified' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}
