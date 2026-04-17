import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import PriceHistory from "@/models/PriceHistory";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await dbConnect();

    const products = await Product.find({ usersTracking: user.id })
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("User Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracked products" },
      { status: 500 }
    );
  }
}
