import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import PriceHistory from "@/models/PriceHistory";

export async function GET(req, { params }) {
  try {
    const { id } = await params; // App router dynamic route
    
    await dbConnect();

    const product = await Product.findById(id);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const history = await PriceHistory.find({ product: id })
      .sort({ date: 1 });

    // Get min/max from DB efficiently
    const lowestPriceRecord = await PriceHistory.findOne({ product: id }).sort({ price: 1 });
    const highestPriceRecord = await PriceHistory.findOne({ product: id }).sort({ price: -1 });
    
    const lowestPrice = lowestPriceRecord ? lowestPriceRecord.price : product.currentPrice;
    const highestPrice = highestPriceRecord ? highestPriceRecord.price : product.currentPrice;

    // Recommendation logic: Last 10 prices
    const recentHistory = await PriceHistory.find({ product: id }).sort({ date: -1 }).limit(10);
    let recommendation = "WAIT"; 
    
    if (recentHistory.length > 0) {
      const sum = recentHistory.reduce((acc, h) => acc + h.price, 0);
      const avgPrice = sum / recentHistory.length;

      if (product.currentPrice <= avgPrice) {
        recommendation = "BUY_NOW";
      } else if (recentHistory.length >= 2 && recentHistory[0].price > recentHistory[1].price) {
        // Price increasing recently -> BUY NOW
        recommendation = "BUY_NOW";
      }
    }

    return NextResponse.json({ 
      product, 
      history,
      lowestPrice,
      highestPrice,
      recommendation,
      trackingCount: product.trackingCount || 1
    });
  } catch (error) {
    console.error("Get Product Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
