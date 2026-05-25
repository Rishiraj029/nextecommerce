import { NextResponse } from "next/server";
import { getProductById } from "@/lib/db";
import { connectDB } from "@/lib/db/connect";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id]:", error);
    return NextResponse.json(
      { message: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
