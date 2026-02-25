import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerId,
      farmerId,
      productType,
      breed,
      quantity,
      price,
      weight,
      minimumGuaranteedWeight,
    } = body;

    // Validation
    if (!customerId || !farmerId || !productType) {
      return NextResponse.json(
        { error: "Customer ID, Farmer ID, and Product Type are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Check if item already exists in wishlist
    const existingItem = await db.collection("wishlist").findOne({
      customer_id: customerId,
      farmer_id: farmerId,
      product_type: productType,
      breed: breed || "",
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "Item already exists in wishlist" },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = {
      customer_id: customerId,
      farmer_id: farmerId,
      product_type: productType,
      breed: breed || "",
      quantity: quantity || 1,
      price_per_unit: price || 0,
      weight: weight || null,
      minimum_guaranteed_weight: minimumGuaranteedWeight || null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await db.collection("wishlist").insertOne(wishlistItem);

    return NextResponse.json({
      success: true,
      wishlistItem: { ...wishlistItem, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Wishlist add error:", error);
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

    if (!customerId) {
      return NextResponse.json(
        { error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const wishlistItems = await db
      .collection("wishlist")
      .find({ customer_id: customerId })
      .sort({ created_at: -1 })
      .toArray();

    return NextResponse.json({ wishlist: wishlistItems });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const itemId = searchParams.get("itemId");

    if (!customerId || !itemId) {
      return NextResponse.json(
        { error: "Customer ID and Item ID are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    await db.collection("wishlist").deleteOne({
      _id: new ObjectId(itemId),
      customer_id: customerId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Wishlist delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}