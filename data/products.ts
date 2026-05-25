import type { Product } from "@/types";

export type { Product };

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Cancelling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "2",
    name: "Minimalist Leather Wallet",
    description: "Slim, genuine leather wallet with RFID blocking and space for up to 8 cards.",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    category: "Accessories",
  },
  {
    id: "3",
    name: "Smart Fitness Watch",
    description: "Track your workouts, heart rate, and sleep with this sleek, water-resistant smartwatch.",
    price: 199.50,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: "Electronics",
  },
  {
    id: "4",
    name: "Organic Cotton T-Shirt",
    description: "Ultra-soft, ethically made 100% organic cotton t-shirt. Available in multiple colors.",
    price: 24.00,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    category: "Apparel",
  },
  {
    id: "5",
    name: "Stainless Steel Water Bottle",
    description: "Insulated double-wall bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 35.00,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    category: "Home",
  },
  {
    id: "6",
    name: "Mechanical Keychron Keyboard",
    description: "Wireless mechanical keyboard with tactile switches, perfect for typing and gaming.",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
    category: "Electronics",
  }
];
