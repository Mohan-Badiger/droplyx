import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { scrapeProductUrl } from "../lib/scraper.js";

// Basic setup to run standalone script
dotenv.config();

// Re-implementing simplistic model schemas to run without Next.js NextApi context
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.MONGODB_URI);
};

const ProductSchema = new mongoose.Schema({
  url: String, platform: String, title: String, imageUrl: String, currentPrice: Number, usersTracking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const PriceHistorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, price: Number, date: { type: Date, default: Date.now }
});
const PriceHistory = mongoose.models.PriceHistory || mongoose.model("PriceHistory", PriceHistorySchema);

const AlertSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, targetPrice: Number, status: String
});
const Alert = mongoose.models.Alert || mongoose.model("Alert", AlertSchema);

const UserSchema = new mongoose.Schema({ email: String });
const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function runPriceTracker() {
  console.log("Starting price tracker job...");
  try {
    await connectDB();
    const products = await Product.find({});
    
    for (const product of products) {
      try {
        console.log(`Scraping ${product.platform} product: ${product.url.substring(0, 50)}...`);
        const data = await scrapeProductUrl(product.url);
        
        if (data && data.currentPrice !== product.currentPrice) {
          console.log(`Price changed for ${product.title}: ${product.currentPrice} -> ${data.currentPrice}`);
          
          // Update Product
          product.currentPrice = data.currentPrice;
          await product.save();
          
          // Add History
          await PriceHistory.create({ product: product._id, price: data.currentPrice });

          // Check Alerts
          const alerts = await Alert.find({ product: product._id, status: "active" }).populate("user");
          for (const alert of alerts) {
            if (data.currentPrice <= alert.targetPrice) {
              await sendAlertEmail(alert.user.email, product, data.currentPrice);
              
              // Depending on logic, set alert to triggered or leave active for further drops.
              alert.status = "triggered";
              await alert.save();
            }
          }
        } else {
          console.log(`No price change for ${product.title}`);
        }
        
      } catch (err) {
        console.error(`Failed to update product ${product._id}:`, err.message);
      }
    }
  } catch (error) {
    console.error("Job failed:", error);
  } finally {
    console.log("Price tracker job completed.");
    process.exit(0);
  }
}

async function sendAlertEmail(email, product, newPrice) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@droplyx.com",
      to: email,
      subject: `🚨 Price Drop Alert: ${product.title}`,
      text: `Good news! The price for ${product.title} has dropped to ₹${newPrice}. Check it out: ${product.url}`,
      html: `<h2>Price Drop Alert!</h2><p>Good news! The price for <b>${product.title}</b> has dropped to <b>₹${newPrice}</b>.</p><a href="${product.url}">Click here to buy now</a>`,
    };

    if (process.env.EMAIL_USER) {
      await transporter.sendMail(mailOptions);
      console.log(`Alert email sent to ${email}`);
    } else {
      console.log(`[DEV] Would send alert email to ${email} for price ${newPrice}`);
    }
  } catch (error) {
    console.error("Failed to send alert email", error);
  }
}

// Execute
runPriceTracker();
