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

    const { alertId } = await req.json();
    if (!alertId) {
      return NextResponse.json({ error: "Alert ID is required" }, { status: 400 });
    }

    await dbConnect();

    const alert = await Alert.findOneAndDelete({ _id: alertId, user: user.id });

    if (!alert) {
      return NextResponse.json({ error: "Alert not found or not owned by user" }, { status: 404 });
    }

    return NextResponse.json({ message: "Alert deleted successfully", success: true });
  } catch (error) {
    console.error("Delete Alert Error:", error);
    return NextResponse.json(
      { error: "Failed to delete alert" },
      { status: 500 }
    );
  }
}
