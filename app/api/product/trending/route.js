import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({})
      .sort({ trackingCount: -1 })
      .limit(10)
      .select("title currentPrice imageUrl trackingCount platform");

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Trending Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending products" },
      { status: 500 }
    );
  }
}
