"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types";
import { Loader2, Package } from "lucide-react";

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders/mine");
        if (res.ok) setOrders(await res.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Account</h1>
        <p className="mt-3 text-gray-500">
          Sign in on the home page to view your order history.
        </p>
        <Link
          href="/#auth"
          className="mt-6 inline-block text-indigo-600 font-medium hover:text-indigo-500"
        >
          Go to sign in →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900">My account</h1>
      <p className="mt-2 text-gray-500">
        {user.name} · {user.email}
      </p>

      <h2 className="mt-10 text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Package className="h-5 w-5 text-indigo-600" />
        Order history
      </h2>

      {orders.length === 0 ? (
        <p className="mt-4 text-gray-500 bg-white border border-gray-200 rounded-lg p-6">
          No orders yet. Place an order while signed in to see it here.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-sm font-medium text-indigo-600">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()} ·{" "}
                    {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">${order.total.toFixed(2)}</p>
              </div>
              <Link
                href={`/orders/${order.id}`}
                className="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-500"
              >
                View details →
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link href="/" className="mt-8 inline-block text-sm text-gray-600 hover:text-gray-900">
        ← Continue shopping
      </Link>
    </div>
  );
}
