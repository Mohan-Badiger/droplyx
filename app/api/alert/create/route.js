import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Alert from "@/models/Alert";
import { verifyToken } from "@/lib/auth";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { productId, targetPrice } = await req.json();
    if (!productId || !targetPrice) {
      return NextResponse.json({ error: "Product ID and Target Price are required" }, { status: 400 });
    }

    await dbConnect();

    // Upsert Alert (one active alert per product per user)
    const alert = await Alert.findOneAndUpdate(
      { user: user.id, product: productId },
      { targetPrice, status: "active" },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: "Alert created successfully", alert });
  } catch (error) {
    console.error("Create Alert Error:", error);
    return NextResponse.json(
      { error: "Failed to create alert" },
      { status: 500 }
    );
  }
}
