import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import PriceHistory from "@/models/PriceHistory";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // App router dynamic route
    
    await dbConnect();

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const history = await PriceHistory.find({ product: id })
      .sort({ date: 1 })
      .limit(30); // Get last 30 entries (e.g. 30 days)

    return NextResponse.json({ product, history });
  } catch (error) {
    console.error("Get Product Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
