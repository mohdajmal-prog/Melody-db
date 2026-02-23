import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

async function getDb() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
  }
  return client.db();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      items,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentId,
      deliveryFee,
      gst,
    } = body;

    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const db = await getDb();

    const order = {
      _id: orderId,
      customerId,
      totalAmount,
      deliveryFee,
      gst,
      paymentMethod,
      paymentId,
      deliveryAddress,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: items.map((item: any) => ({
        farmerId: item.farmerId,
        productType: item.productType,
        breed: item.breed,
        quantity: item.quantity,
        pricePerUnit: item.price || item.pricePerUnit,
        totalPrice: (item.price || item.pricePerUnit) * item.quantity,
        weight: item.weight,
        minimumGuaranteedWeight: item.minimumGuaranteedWeight,
      })),
    };

    await db.collection("orders").insertOne(order);

    return NextResponse.json({
      success: true,
      orderId,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const filter: any = { customerId };
    if (status) filter.status = status;

    const orders = await db.collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
