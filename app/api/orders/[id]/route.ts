import { NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";
import { connectDB } from "@/lib/db/connect";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET /api/orders/[id]:", error);
    return NextResponse.json(
      { message: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
