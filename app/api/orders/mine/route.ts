import { NextResponse } from "next/server";
import { getOrdersByUserId } from "@/lib/db";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db/connect";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Not signed in" }, { status: 401 });
  }

  try {
    await connectDB();
    const orders = await getOrdersByUserId(session.userId);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders/mine:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
