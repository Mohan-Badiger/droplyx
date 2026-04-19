import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    await dbConnect();

    // Find the product
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if user actually tracks it
    if (product.trackedBy.includes(user.id)) {
      product.trackedBy = product.trackedBy.filter(id => id.toString() !== user.id);
      product.trackingCount = product.trackedBy.length;
      await product.save();
      return NextResponse.json({ message: "Product no longer tracked", success: true });
    } else {
      return NextResponse.json({ message: "Product not currently tracked by user", success: true });
    }
  } catch (error) {
    console.error("Untrack Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
