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
          bankAccount: data.bankAccount,
          ifsc: data.ifsc,
          village: data.farmLocation,
          farmSize: data.farmSize,
          products: data.products,
          farmerStatus: 'pending',
          photo: data.selfie,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Farmer registration submitted' });
  } catch (error) {
    console.error('Farmer registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
