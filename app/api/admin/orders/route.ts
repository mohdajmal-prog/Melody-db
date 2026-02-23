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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");

    const db = await getDb();
    const filter: any = {};
    if (status) filter.status = status;

    const orders = await db.collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}