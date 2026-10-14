import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import PriceHistory from "@/models/PriceHistory";
import Alert from "@/models/Alert";
import User from "@/models/User";
import { scrapeProductUrl } from "@/lib/scraper";
import nodemailer from "nodemailer";

export const maxDuration = 60; // Allow maximum runtime on Vercel Pro/serverless
export const dynamic = "force-dynamic";

export async function GET(req) {
  // Authorization check for Vercel Cron or custom cron services
  const authHeader = req.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const products = await Product.find({
      trackedBy: { $exists: true, $not: { $size: 0 } },
    }).limit(10); // Batch size to stay comfortably within execution windows

    let updatedCount = 0;
    let alertsSent = 0;

    for (const product of products) {
      try {
        const scraped = await scrapeProductUrl(product.url);

        if (!scraped || !scraped.currentPrice) {
          continue;
        }

        const oldPrice = product.currentPrice;
        product.lastChecked = new Date();

        if (scraped.currentPrice !== oldPrice) {
          product.currentPrice = scraped.currentPrice;
          await product.save();

          await PriceHistory.create({
            product: product._id,
            price: scraped.currentPrice,
          });

          updatedCount++;

          // Check if any user target alerts have been triggered
          const activeAlerts = await Alert.find({
            product: product._id,
            status: "active",
          }).populate("user");

          for (const alert of activeAlerts) {
            if (scraped.currentPrice <= alert.targetPrice && alert.user?.email) {
              await sendNotificationEmail(
                alert.user.email,
                product,
                scraped.currentPrice,
                "Target Price Reached!"
              );
              alert.status = "triggered";
              await alert.save();
              alertsSent++;
            }
          }

          // Universal price drop notification if price decreased
          if (scraped.currentPrice < oldPrice) {
            const users = await User.find({ _id: { $in: product.trackedBy } });
            for (const user of users) {
              if (user.email) {
                await sendNotificationEmail(
                  user.email,
                  product,
                  scraped.currentPrice,
                  "Price Dropped!"
                );
                alertsSent++;
              }
            }
          }
        } else {
          await product.save();
        }
      } catch (productErr) {
        console.error(`Error updating product ${product._id}:`, productErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      scanned: products.length,
      updated: updatedCount,
      alertsSent,
    });
  } catch (error) {
    console.error("Cron Job Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}

async function sendNotificationEmail(email, product, newPrice, subjectType) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV CRON] Would send alert to ${email} for ${product.title}: ₹${newPrice}`);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🚨 ${subjectType}: ${product.title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">${subjectType}</h2>
          <p>Great news! The price for <strong>${product.title}</strong> has changed to <strong>₹${newPrice}</strong>.</p>
          <a href="${product.url}" style="display: inline-block; background-color: #0f172a; color: #fff; padding: 10px 18px; border-radius: 4px; text-decoration: none; font-weight: 600;">View Product</a>
        </div>
      `,
    });
  } catch (err) {
    console.warn("Cron notification email failed:", err.message);
  }
}
