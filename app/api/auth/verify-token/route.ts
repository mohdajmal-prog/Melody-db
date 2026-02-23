import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { idToken, phoneNumber } = await request.json();

    if (!idToken || !phoneNumber) {
      return NextResponse.json({ error: 'ID token and phone number are required' }, { status: 400 });
    }

    // For now, we'll do basic validation
    // In production, you should verify the Firebase ID token with Firebase Admin SDK
    return NextResponse.json({
      success: true,
      phoneNumber,
      verified: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}