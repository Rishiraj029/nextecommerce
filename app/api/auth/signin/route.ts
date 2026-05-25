import { NextResponse } from "next/server";
import { verifyUser } from "@/lib/users";
import { createSession, isAuthConfigured } from "@/lib/session";
import { isDbConfigured, connectDB } from "@/lib/db/connect";

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { message: "Add MONGODB_URI to .env to sign in", redirectToSignup: true },
      { status: 503 }
    );
  }

  if (!isAuthConfigured()) {
    return NextResponse.json(
      { message: "Add AUTH_SECRET to .env (min 16 characters)", redirectToSignup: false },
      { status: 503 }
    );
  }

  try {
    await connectDB();

    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { message: "Email and password are required", redirectToSignup: false },
        { status: 400 }
      );
    }

    const result = await verifyUser(email, password);

    if (!result.ok) {
      const redirectToSignup = true;
      const message =
        result.reason === "not_found"
          ? "No account found with this email. Please sign up."
          : "Incorrect password. Create a new account or try again.";

      return NextResponse.json(
        { message, redirectToSignup },
        { status: 401 }
      );
    }

    await createSession({
      userId: result.user.id,
      email: result.user.email,
      name: result.user.name,
    });

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("POST /api/auth/signin:", error);
    return NextResponse.json(
      { message: "Failed to sign in", redirectToSignup: false },
      { status: 500 }
    );
  }
}
