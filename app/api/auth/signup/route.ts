import { NextResponse } from "next/server";
import { createUser } from "@/lib/users";
import { createSession, isAuthConfigured } from "@/lib/session";
import { isDbConfigured, connectDB } from "@/lib/db/connect";

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { message: "Add MONGODB_URI to .env to create an account" },
      { status: 503 }
    );
  }

  if (!isAuthConfigured()) {
    return NextResponse.json(
      { message: "Add AUTH_SECRET to .env (min 16 characters)" },
      { status: 503 }
    );
  }

  try {
    await connectDB();

    const { name, email, password } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const user = await createUser({ name, email, password });
    await createSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to sign up";
    const status = message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
