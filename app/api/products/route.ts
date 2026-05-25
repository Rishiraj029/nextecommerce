import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/db";
import { connectDB } from "@/lib/db/connect";

export async function GET() {
  try {
    await connectDB();
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products:", error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
