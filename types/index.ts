export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserProfile extends User {
  address: string;
  city: string;
  zip: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  customer: CustomerInfo;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed";
  createdAt: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  customer: CustomerInfo;
  userId?: string;
}
