import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db('melody');
    
    const subscriptions = await db.collection('subscriptions')
      .find({ userId })
      .toArray();

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json({ subscriptions: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, quantity, farmer, price, frequency, status, nextDelivery, savings } = body;

    const client = await clientPromise;
    const db = client.db('melody');
    
    const subscription = {
      userId,
      type,
      quantity,
      farmer,
      price,
      frequency,
      status: status || 'active',
      nextDelivery,
      savings,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('subscriptions').insertOne(subscription);

    return NextResponse.json({ 
      success: true, 
      subscription: { ...subscription, id: result.insertedId.toString() }
    });
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const client = await clientPromise;
    const db = client.db('melody');
    const { ObjectId } = require('mongodb');

    await db.collection('subscriptions').updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update subscription:', error);
    return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
  }
}
