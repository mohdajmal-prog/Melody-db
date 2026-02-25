import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { phone, role } = await request.json();

    const client = await clientPromise;
    const db = client.db('melody');
    
    // Update user status and add role to roles array
    await db.collection('users').updateOne(
      { phone },
      { 
        $set: { 
          [`${role}Status`]: 'approved',
          approvedAt: new Date(),
          updatedAt: new Date()
        },
        $addToSet: { roles: role } // Add role to roles array if not already present
      }
    );

    return NextResponse.json({
      success: true,
      message: `${role} KYC approved successfully`,
      data: { phone, role, status: 'approved' },
    });
  } catch (error) {
    console.error('Approve KYC error:', error);
    return NextResponse.json({ error: 'Failed to approve KYC' }, { status: 500 });
  }
}
