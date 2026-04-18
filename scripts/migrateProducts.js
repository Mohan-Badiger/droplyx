import mongoose from "mongoose";
import dotenv from "dotenv";
import { normalizeUrl } from "../lib/normalizeUrl.js";

dotenv.config();

// Define schemas explicitly to avoid Next.js module conflicts in standalone script
const ProductSchema = new mongoose.Schema({
  url: String,
  platform: String,
  title: String,
  imageUrl: String,
  currentPrice: Number,
  usersTracking: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Legacy field
  trackedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field
  trackingCount: { type: Number, default: 1 },
});
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const PriceHistorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  price: Number,
  date: { type: Date, default: Date.now }
});
const PriceHistory = mongoose.models.PriceHistory || mongoose.model("PriceHistory", PriceHistorySchema);

const AlertSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});
const Alert = mongoose.models.Alert || mongoose.model("Alert", AlertSchema);

async function migrateProducts() {
  console.log("Starting Product Migration...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Get all products
    const rawProducts = await Product.find({});
    
    // Group by normalized URL
    const grouped = {};
    for (const p of rawProducts) {
      const cleanUrl = normalizeUrl(p.url);
      if (!grouped[cleanUrl]) {
        grouped[cleanUrl] = [];
      }
      grouped[cleanUrl].push(p);
    }

    console.log(`Found ${rawProducts.length} total legacy products. Grouped into ${Object.keys(grouped).length} unique URLs.`);

    for (const cleanUrl of Object.keys(grouped)) {
      const group = grouped[cleanUrl];
      
      // The first becomes the "Master"
      const masterProduct = group[0];
      
      // Update its URL fully in case it wasn't normalized
      masterProduct.url = cleanUrl;

      // Extract all tracking users from usersTracking and trackedBy across all duplicates
      const allUsers = new Set();
      group.forEach(p => {
        (p.usersTracking || []).forEach(userId => allUsers.add(userId.toString()));
        (p.trackedBy || []).forEach(userId => allUsers.add(userId.toString()));
      });

      masterProduct.trackedBy = Array.from(allUsers);
      masterProduct.trackingCount = masterProduct.trackedBy.length || 1;
      masterProduct.usersTracking = undefined; // Drop legacy reference

      await masterProduct.save();

      // Skip processing duplicates if this is the only one
      if (group.length === 1) continue;

      // Process duplicates
      const duplicates = group.slice(1);
      const duplicateIds = duplicates.map(d => d._id);

      // Reassign Price History to Master
      await PriceHistory.updateMany({ product: { $in: duplicateIds } }, { $set: { product: masterProduct._id } });
      
      // Reassign Alerts to Master
      await Alert.updateMany({ product: { $in: duplicateIds } }, { $set: { product: masterProduct._id } });

      // Delete the duplicate products
      await Product.deleteMany({ _id: { $in: duplicateIds } });

      console.log(`Merged ${duplicates.length} duplicates into Master: ${masterProduct.title}`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration Failed:", error);
  } finally {
    process.exit(0);
  }
}

migrateProducts();
