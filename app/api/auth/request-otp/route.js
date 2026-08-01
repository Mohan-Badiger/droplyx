import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Hash the OTP before storing it
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Upsert User
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, otp: hashedOtp, otpExpiry });
    } else {
      user.otp = hashedOtp;
      user.otpExpiry = otpExpiry;
    }
    await user.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Or whatever service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@droplyx.com",
      to: email,
      subject: "Your DropLyx Login OTP",
      text: `Your verification code for DropLyx is ${otp}. It is valid for 10 minutes.`,
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your DropLyx Login OTP</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
          <!-- Top Border Accent -->
          <tr>
            <td height="4" style="background-color: #0f172a; line-height: 4px; font-size: 0px;">&nbsp;</td>
          </tr>
          
          <!-- Content Area -->
          <tr>
            <td style="padding: 40px 32px;">
              <!-- Header Brand Logo -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <span style="font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">DropLyx<span style="color: #f97316;">.</span></span>
                  </td>
                </tr>
              </table>
              
              <!-- Subject / Greeting -->
              <h1 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 28px;">Verification Code</h1>
              
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #475569;">
                Please use the following 6-digit verification code to complete your login request:
              </p>
              
              <!-- OTP Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center">
                    <div style="font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center; color: #0f172a; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 14px 20px 14px 28px; display: inline-block; font-family: monospace;">
                      ${otp}
                    </div>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0 0; font-size: 13px; line-height: 20px; color: #64748b;">
                This verification code is valid for <strong>10 minutes</strong>. For security reasons, do not share this code with anyone.
              </p>
              
              <!-- Divider -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 32px; border-top: 1px solid #f1f5f9;">
                <tr>
                  <td height="1" style="font-size: 0px; line-height: 0px;">&nbsp;</td>
                </tr>
              </table>
              
              <!-- Security footer -->
              <p style="margin: 16px 0 0 0; font-size: 12px; line-height: 18px; color: #94a3b8;">
                If you did not request this login code, you can safely ignore this email. Someone may have entered your email address by mistake.
              </p>
            </td>
          </tr>
        </table>
        
        <!-- Footer -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin-top: 20px;">
          <tr>
            <td align="center" style="font-size: 11px; line-height: 16px; color: #94a3b8; text-align: center;">
              &copy; 2026 DropLyx. All rights reserved. <br>
              This is an automated message, please do not reply.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.warn("SMTP Failed to send email");
      }
    } else {
      // In development fallback, log that OTP flow was triggered but keep actual code secure
      console.log(`[DEV MODE] OTP verification requested for ${email}`);
    }

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("OTP Request Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
