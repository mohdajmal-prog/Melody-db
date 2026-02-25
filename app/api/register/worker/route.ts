import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('melody');
    
    await db.collection('users').updateOne(
      { phone: data.mobileNumber },
      { 
        $set: { 
          name: data.fullName,
          age: data.age,
          aadharNumber: data.aadharNumber,
          workerStatus: 'pending',
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Worker registration submitted' });
  } catch (error) {
    console.error('Worker registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
