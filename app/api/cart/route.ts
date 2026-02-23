import { NextRequest, NextResponse } from "next/server";
import { cartStorage } from "@/lib/cart-storage";

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

    console.log('Cart POST request:', { customerId, farmerId, productType, breed, quantity, price });

    if (!customerId || !farmerId || !productType) {
      return NextResponse.json(
        { error: "Customer ID, Farmer ID, and Product Type are required" },
        { status: 400 }
      );
    }

    const item = await cartStorage.addItem(customerId, {
      farmerId,
      productType,
      breed: breed || "",
      quantity: quantity || 1,
      pricePerUnit: price || 0,
      weight,
      minimumGuaranteedWeight,
    });

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
      cartItemId: item.id,
    });
  } catch (error: any) {
    console.error("Cart add error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
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

    const cartItems = await cartStorage.getItems(customerId);
    return NextResponse.json({ cart: cartItems });
  } catch (error) {
    console.error("Cart fetch error:", error);
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

    await cartStorage.removeItem(customerId, itemId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart delete error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, itemId, quantity } = body;

    if (!customerId || !itemId || quantity === undefined) {
      return NextResponse.json(
        { error: "Customer ID, Item ID, and quantity are required" },
        { status: 400 }
      );
    }

    await cartStorage.updateQuantity(customerId, itemId, parseFloat(quantity));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}