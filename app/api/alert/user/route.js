import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Alert from "@/models/Alert";
import { verifyToken } from "@/lib/auth";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    await dbConnect();

    const alerts = await Alert.find({ user: user.id })
      .populate("product")
      .sort({ createdAt: -1 });

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Fetch Alerts Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
