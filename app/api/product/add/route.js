import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import PriceHistory from "@/models/PriceHistory";
import { verifyToken } from "@/lib/auth";
import { scrapeProductUrl } from "@/lib/scraper";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const user = verifyToken(token);
    if (!user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    await dbConnect();

    // Check if product already exists
    let product = await Product.findOne({ url });

    if (product) {
      // Add user to tracking list if not already there
      if (!product.usersTracking.includes(user.id)) {
        product.usersTracking.push(user.id);
        await product.save();
      }
      return NextResponse.json({ message: "Product already tracked, added to your wishlist", product });
    }

    // Scrape new product
    const scrapedData = await scrapeProductUrl(url);
    if (!scrapedData) {
      return NextResponse.json({ error: "Failed to read product data" }, { status: 500 });
    }

    product = new Product({
      url,
      platform: scrapedData.platform,
      title: scrapedData.title,
      imageUrl: scrapedData.imageUrl,
      currentPrice: scrapedData.currentPrice,
      originalPrice: scrapedData.currentPrice, // Just setting initial as original
      usersTracking: [user.id]
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
      { error: error.message || "Failed to add product" },
      { status: 500 }
    );
  }
}
