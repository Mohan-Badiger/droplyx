import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { signToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check account lockout status
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockUntil - new Date()) / (60 * 1000));
      return NextResponse.json(
        { error: `Account is temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.` },
        { status: 429 }
      );
    }

    // Check if OTP is present and verify OTP expiry first
    if (!user.otp || !user.otpExpiry) {
      return NextResponse.json({ error: "No active OTP found. Please request a new one." }, { status: 400 });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Verify OTP value using bcrypt comparison
    const isOtpValid = await bcrypt.compare(otp, user.otp);
    if (!isOtpValid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account for 15 minutes after 5 failed attempts
      if (user.loginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
      await user.save();

      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Reset login attempts and clear OTP upon successful login
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = signToken({ id: user._id, email: user.email, role: user.role });

    const response = NextResponse.json({
      message: "Logged in successfully",
      user: { id: user._id, email: user.email, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
