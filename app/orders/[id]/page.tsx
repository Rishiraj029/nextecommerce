"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Loader2, Package } from "lucide-react";
import type { Order } from "@/types";

export default function OrderConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const orderNumberFromUrl = searchParams.get("number");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          setOrder(await res.json());
        } else if (orderNumberFromUrl) {
          setOrder({
            id,
            orderNumber: orderNumberFromUrl,
            items: [],
            customer: { name: "", email: "", address: "", city: "", zip: "" },
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
            status: "confirmed",
            createdAt: new Date().toISOString(),
          });
        }
      } catch {
        if (orderNumberFromUrl) {
          setOrder({
            id,
            orderNumber: orderNumberFromUrl,
            items: [],
            customer: { name: "", email: "", address: "", city: "", zip: "" },
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
            status: "confirmed",
            createdAt: new Date().toISOString(),
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id, orderNumberFromUrl]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const displayNumber = order?.orderNumber ?? orderNumberFromUrl ?? id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900">Order confirmed!</h1>
      <p className="mt-3 text-gray-600">
        Thanks for your purchase. Your order has been saved.
      </p>

      <div className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-100 px-5 py-3 text-indigo-900 font-mono text-sm">
        <Package className="h-4 w-4" />
        {displayNumber}
      </div>

      {order && order.items.length > 0 && (
        <div className="mt-10 text-left bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="font-medium text-gray-900 mb-4">Items ordered</h2>
          <ul className="space-y-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex gap-3 items-center">
                <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">× {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          {order.total > 0 && (
            <p className="mt-4 pt-4 border-t border-gray-100 text-right font-medium text-gray-900">
              Total: ${order.total.toFixed(2)}
            </p>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/account"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          My orders
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white px-6 py-3 text-sm font-medium hover:bg-indigo-700"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
