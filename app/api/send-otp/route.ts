import { NextResponse } from 'next/server';

const otpStore = new Map();

async function sendSMS(phone: string, otp: string) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  
  if (!apiKey || apiKey === 'your_fast2sms_api_key_here') {
    console.log(`[DEV MODE] OTP for ${phone}: ${otp}`);
    return { success: true, dev: true };
  }
  
  try {
    const message = `Your Melody OTP is ${otp}. Valid for 10 minutes. Do not share.`;
    const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=q&message=${encodeURIComponent(message)}&flash=0&numbers=${phone}`;
    
    const response = await fetch(url, { method: 'GET' });
    const data = await response.json();
    
    return { success: data.return, data };
  } catch (error) {
    console.error('Fast2SMS error:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    
    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      attempts: 0
    });
    
    const result = await sendSMS(phone, otp);
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP sent successfully',
      otp: result.dev ? otp : undefined
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
