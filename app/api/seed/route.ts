import { NextResponse } from "next/server";
import { seedProducts } from "@/lib/db";
import { isDbConfigured, connectDB } from "@/lib/db/connect";

export async function POST() {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { message: "Add MONGODB_URI to .env first, then call POST /api/seed again." },
      { status: 400 }
    );
  }

  try {
    await connectDB();
    const result = await seedProducts();
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/seed:", error);
    return NextResponse.json(
      { message: "Failed to seed database" },
      { status: 500 }
    );
  }
}
