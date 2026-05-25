import { NextResponse } from "next/server";
import { createOrder } from "@/lib/db";
import { getSession } from "@/lib/session";
import { updateUserProfile } from "@/lib/users";
import { connectDB } from "@/lib/db/connect";
import type { CreateOrderPayload } from "@/types";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = (await request.json()) as CreateOrderPayload;
    const session = await getSession();

    if (!body.items?.length) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    const { name, email, address, city, zip } = body.customer ?? {};
    if (!name?.trim() || !email?.trim() || !address?.trim() || !city?.trim() || !zip?.trim()) {
      return NextResponse.json(
        { message: "Please fill in all shipping details" },
        { status: 400 }
      );
    }

    const customer = {
      name: name.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      zip: zip.trim(),
    };

    if (session) {
      await updateUserProfile(session.userId, {
        name: customer.name,
        address: customer.address,
        city: customer.city,
        zip: customer.zip,
      });
    }

    const order = await createOrder({
      items: body.items,
      customer,
      userId: session?.userId,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders:", error);
    return NextResponse.json(
      { message: "Failed to place order" },
      { status: 500 }
    );
  }
}
