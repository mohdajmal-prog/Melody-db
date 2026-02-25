import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const { phone, role } = await request.json();

    const client = await clientPromise;
    const db = client.db('melody');
    
    // Update user status and remove role from roles array
    await db.collection('users').updateOne(
      { phone },
      { 
        $set: { 
          [`${role}Status`]: 'revoked',
          revokedAt: new Date(),
          updatedAt: new Date()
        },
        $pull: { roles: role } // Remove role from roles array
      }
    );

    return NextResponse.json({
      success: true,
      message: `${role} approval revoked successfully`,
      data: { phone, role, status: 'revoked' },
    });
  } catch (error) {
    console.error('Revoke KYC error:', error);
    return NextResponse.json({ error: 'Failed to revoke approval' }, { status: 500 });
  }
}