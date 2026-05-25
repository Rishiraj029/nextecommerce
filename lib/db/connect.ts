import mongoose from "mongoose";
import { products as staticProducts } from "@/data/products";
import { Product } from "@/lib/models/Product";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "modernshop";

declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
    seeded: boolean;
  } | undefined;
}

const cached = global.mongooseConn ?? { conn: null, promise: null, seeded: false };
global.mongooseConn = cached;

export function isDbConfigured(): boolean {
  return Boolean(uri && uri.length > 0);
}

async function seedProductsIfEmpty(): Promise<void> {
  if (cached.seeded) return;

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(
      staticProducts.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        image: p.image,
        category: p.category,
        stock: 50,
      }))
    );
    console.log(`Seeded ${staticProducts.length} products into MongoDB`);
  }
  cached.seeded = true;
}

/** Connect to MongoDB — logs "Db Connected" once per server process */
export async function connectDB(): Promise<typeof mongoose> {
  if (!isDbConfigured()) {
    throw new Error("MONGODB_URI is not set in .env or .env.local");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri!, { dbName })
      .then(async (mongooseInstance) => {
        console.log("Db Connected");
        await seedProductsIfEmpty();
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("MongoDB connection error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
