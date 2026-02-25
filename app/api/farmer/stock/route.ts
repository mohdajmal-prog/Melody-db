import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      animalType,
      breed,
      weightRangeMin,
      weightRangeMax,
      age,
      quantity,
      price,
      farmerId,
    } = body;

    // Validation
    if (!weightRangeMin || !weightRangeMax) {
      return NextResponse.json(
        { error: "Both minimum and maximum weights are required" },
        { status: 400 }
      );
    }

    if (weightRangeMin >= weightRangeMax) {
      return NextResponse.json(
        { error: "Minimum weight must be less than maximum weight" },
        { status: 400 }
      );
    }

    if (weightRangeMin <= 0 || weightRangeMax <= 0) {
      return NextResponse.json(
        { error: "Weights must be positive values" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const newStockItem = {
      farmer_id: farmerId || "default-farmer",
      animal_type: animalType || "Unknown",
      breed: breed || "",
      weight_range_min: Number(weightRangeMin),
      weight_range_max: Number(weightRangeMax),
      minimum_guaranteed_weight: Number(weightRangeMin),
      age: age || "",
      quantity: Number(quantity) || 1,
      price: Number(price) || 0,
      status: "available",
      video_uploaded: false,
      created_at: new Date(),
    };

    const result = await db.collection("farmer_stock").insertOne(newStockItem);

    return NextResponse.json({
      success: true,
      stockItem: { ...newStockItem, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Error adding farmer stock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const farmerId =
      request.nextUrl.searchParams.get("farmerId") || "default-farmer";

    const { db } = await connectToDatabase();
    const stock = await db
      .collection("farmer_stock")
      .find({ farmer_id: farmerId })
      .toArray();

    return NextResponse.json({
      success: true,
      stock,
    });
  } catch (error) {
    console.error("Error fetching farmer stock:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
