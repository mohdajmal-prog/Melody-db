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
          age: data.age,
          institution: data.institution,
          studentStatus: 'pending',
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Student registration submitted' });
  } catch (error) {
    console.error('Student registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
