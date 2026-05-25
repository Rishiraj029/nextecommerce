import mongoose, { Schema, models, model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  address: string;
  city: string;
  zip: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    zip: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = models.User || model<IUser>("User", UserSchema);
