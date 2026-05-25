import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { Product as ProductModel } from "@/lib/models/Product";
import { Order as OrderModel } from "@/lib/models/Order";
import { products as staticProducts } from "@/data/products";
import type { CreateOrderPayload, Order, Product } from "@/types";

function mapProduct(doc: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
}): Product {
  return {
    id: doc.id,
    name: doc.name,
    description: doc.description,
    price: doc.price,
    image: doc.image,
    category: doc.category,
    stock: doc.stock,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return staticProducts;

  await connectDB();
  const docs = await ProductModel.find({}).sort({ name: 1 }).lean();
  if (docs.length === 0) return staticProducts;
  return docs.map((d) => mapProduct(d));
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isDbConfigured()) {
    return staticProducts.find((p) => p.id === id) ?? null;
  }

  await connectDB();
  const doc = await ProductModel.findOne({ id }).lean();
  if (!doc) return staticProducts.find((p) => p.id === id) ?? null;
  return mapProduct(doc);
}

export async function seedProducts(): Promise<{ inserted: number; message: string }> {
  if (!isDbConfigured()) {
    return { inserted: 0, message: "Set MONGODB_URI in .env to seed the database" };
  }

  await connectDB();
  const count = await ProductModel.countDocuments();

  if (count > 0) {
    return { inserted: 0, message: `Database already has ${count} products. Skipping seed.` };
  }

  const docs = staticProducts.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    category: p.category,
    stock: 50,
  }));

  await ProductModel.insertMany(docs);
  return { inserted: docs.length, message: `Seeded ${docs.length} products into MongoDB` };
}

function generateOrderNumber(): string {
  const part = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${part}-${rand}`;
}

export function calculateOrderTotals(subtotal: number) {
  const shipping = subtotal > 75 ? 0 : 5.99;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  return { subtotal, shipping, tax, total };
}

function mapOrder(doc: {
  _id: { toString(): string };
  orderNumber: string;
  userId?: string | null;
  items: Order["items"];
  customer: Order["customer"];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: Order["status"];
  createdAt?: Date;
  updatedAt?: Date;
}): Order {
  return {
    id: doc._id.toString(),
    orderNumber: doc.orderNumber,
    userId: doc.userId ?? undefined,
    items: doc.items,
    customer: doc.customer,
    subtotal: doc.subtotal,
    shipping: doc.shipping,
    tax: doc.tax,
    total: doc.total,
    status: doc.status,
    createdAt: (doc.createdAt ?? new Date()).toISOString(),
  };
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const subtotal = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const { shipping, tax, total } = calculateOrderTotals(subtotal);
  const orderNumber = generateOrderNumber();

  if (!isDbConfigured()) {
    return {
      id: orderNumber,
      orderNumber,
      userId: payload.userId,
      items: payload.items,
      customer: payload.customer,
      subtotal,
      shipping,
      tax,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
  }

  await connectDB();
  const doc = await OrderModel.create({
    orderNumber,
    userId: payload.userId ?? null,
    items: payload.items,
    customer: payload.customer,
    subtotal,
    shipping,
    tax,
    total,
    status: "confirmed",
  });

  console.log(`Order saved to MongoDB: ${orderNumber}`);

  return mapOrder(doc);
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!isDbConfigured()) return null;

  await connectDB();

  let doc = await OrderModel.findById(id).lean();
  if (!doc) {
    doc = await OrderModel.findOne({ orderNumber: id }).lean();
  }
  if (!doc) return null;

  return mapOrder(doc as Parameters<typeof mapOrder>[0]);
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!isDbConfigured()) return [];

  await connectDB();
  const docs = await OrderModel.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return docs.map((d) => mapOrder(d as Parameters<typeof mapOrder>[0]));
}
