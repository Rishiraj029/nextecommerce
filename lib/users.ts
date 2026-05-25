import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import { User } from "@/lib/models/User";
import type { User as UserType, UserProfile } from "@/types";

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<UserType> {
  await connectDB();

  const email = data.email.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const doc = await User.create({
    name: data.name.trim(),
    email,
    passwordHash,
    address: "",
    city: "",
    zip: "",
  });

  console.log(`User saved to MongoDB: ${email}`);

  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
  };
}

export type VerifyResult =
  | { ok: true; user: UserType }
  | { ok: false; reason: "not_found" | "invalid_password" };

export async function verifyUser(
  email: string,
  password: string
): Promise<VerifyResult> {
  await connectDB();

  const doc = await User.findOne({ email: email.toLowerCase().trim() });
  if (!doc) {
    return { ok: false, reason: "not_found" };
  }

  const valid = await bcrypt.compare(password, doc.passwordHash);
  if (!valid) {
    return { ok: false, reason: "invalid_password" };
  }

  return {
    ok: true,
    user: {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
    },
  };
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  await connectDB();

  const doc = await User.findById(id);
  if (!doc) return null;

  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    address: doc.address || "",
    city: doc.city || "",
    zip: doc.zip || "",
  };
}

export async function updateUserProfile(
  userId: string,
  profile: Partial<Pick<UserProfile, "name" | "address" | "city" | "zip">>
): Promise<void> {
  await connectDB();
  await User.findByIdAndUpdate(userId, { $set: profile });
}
