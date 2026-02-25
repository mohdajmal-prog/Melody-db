import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BulkOrder from '@/models/BulkOrder';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const {
      customerId,
      farmerId,
      productId,
      quantity,
      totalAmount,
      eventType,
      eventDate,
      specialRequirements,
      deliveryAddress,
    } = body;

    const bulkOrder = new BulkOrder({
      customerId,
      farmerId,
      productId,
      quantity,
      totalAmount,
      eventType,
      eventDate,
      specialRequirements,
      deliveryAddress,
      status: 'pending',
      paymentStatus: 'pending',
    });

    await bulkOrder.save();

    return NextResponse.json({
      success: true,
      message: 'Bulk order request submitted successfully',
      orderId: bulkOrder._id,
    });
  } catch (error) {
    console.error('Bulk order creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create bulk order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const farmerId = searchParams.get('farmerId');
    
    let query = {};
    if (customerId) query = { customerId };
    if (farmerId) query = { farmerId };
    
    const bulkOrders = await BulkOrder.find(query)
      .populate('productId')
      .populate('customerId', 'name phone')
      .populate('farmerId', 'name phone')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bulkOrders,
    });
  } catch (error) {
    console.error('Bulk orders fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bulk orders' },
      { status: 500 }
    );
  }
}