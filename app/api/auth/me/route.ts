import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getUserById } from "@/lib/users";
import { connectDB } from "@/lib/db/connect";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const profile = await getUserById(session.userId);

    return NextResponse.json({
      user: profile ?? {
        id: session.userId,
        name: session.name,
        email: session.email,
        address: "",
        city: "",
        zip: "",
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me:", error);
    return NextResponse.json({ user: null });
  }
}
