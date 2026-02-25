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
          license: data.license,
          vehicleType: data.vehicleType,
          vehicleNumber: data.vehicleNumber,
          driverStatus: 'pending',
          photo: data.selfie,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Driver registration submitted' });
  } catch (error) {
    console.error('Driver registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
