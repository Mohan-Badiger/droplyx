import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import PriceHistory from "@/models/PriceHistory";
import { verifyToken } from "@/lib/auth";
import { scrapeProductUrl } from "@/lib/scraper";
import { normalizeUrl } from "@/lib/normalizeUrl";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    await dbConnect();

    const cleanUrl = normalizeUrl(url);

    // Check if product already exists globally
    let product = await Product.findOne({ url: cleanUrl });

    if (product) {
      // Add user to tracking list if not already there
      if (!product.trackedBy.includes(user.id)) {
        product.trackedBy.push(user.id);
        product.trackingCount = product.trackedBy.length;
        await product.save();
      }
      return NextResponse.json({ 
        message: `Already tracked by ${product.trackingCount} users. Showing existing price history.`, 
        product 
      });
    }

    // Scrape new product
    let scrapedData;
    try {
      scrapedData = await scrapeProductUrl(url);
    } catch (scrapeErr) {
      console.warn("Scraper Warning:", scrapeErr.message);
      return NextResponse.json(
        { 
          success: false, 
          error: "Store blocked request or format changed. Try again later.", 
          message: scrapeErr.message 
        }, 
        { status: 400 }
      );
    }

    if (!scrapedData) {
      return NextResponse.json({ error: "Failed to read product data" }, { status: 400 });
    }

    product = new Product({
      url: cleanUrl,
      platform: scrapedData.platform,
      title: scrapedData.title,
      imageUrl: scrapedData.imageUrl,
      currentPrice: scrapedData.currentPrice,
      originalPrice: scrapedData.currentPrice, // Just setting initial as original
      trackedBy: [user.id],
      trackingCount: 1
    });
    
    await product.save();

    // Add Initial Price History
    const history = new PriceHistory({
      product: product._id,
      price: product.currentPrice
    });
    await history.save();

    return NextResponse.json({ message: "Product added and tracking started", product });
  } catch (error) {
    console.error("Add Product Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
