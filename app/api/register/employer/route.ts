import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('melody');
    
    await db.collection('users').updateOne(
      { phone: data.phone },
      { 
        $set: { 
          name: data.fullName,
          aadhaar: data.aadhaar,
          pan: data.pan,
          gst: data.gst,
          businessName: data.businessName,
          businessType: data.businessType,
          bankAccount: data.bankAccount,
          ifsc: data.ifsc,
          employerStatus: 'pending',
          photo: data.selfie,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Employer registration submitted' });
  } catch (error) {
    console.error('Employer registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
