import mongoose, { Schema, models, model } from "mongoose";

export interface IProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
