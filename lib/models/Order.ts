import mongoose, { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { _id: false }
);

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false }
);

export interface IOrder {
  orderNumber: string;
  userId?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed";
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: String, default: null },
    items: { type: [OrderItemSchema], required: true },
    customer: { type: CustomerSchema, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed"], default: "confirmed" },
  },
  { timestamps: true }
);

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
