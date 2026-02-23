import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { phone, role } = await request.json();

    const client = await clientPromise;
    const db = client.db('melody');
    
    await db.collection('users').updateOne(
      { phone },
      { $set: { [`${role}Status`]: 'approved' } }
    );

    return NextResponse.json({
      success: true,
      message: `${role} KYC approved successfully`,
      data: { phone, role, status: 'approved' },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to approve KYC' }, { status: 500 });
  }
}
