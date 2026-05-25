"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Loader2, Lock } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = totalPrice > 75 ? 0 : 5.99;
  const tax = Math.round(totalPrice * 0.08 * 100) / 100;
  const orderTotal = Math.round((totalPrice + shipping + tax) * 100) / 100;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const customer = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      address: form.get("address") as string,
      city: form.get("city") as string,
      zip: form.get("zip") as string,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items: cart.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Checkout failed");

      clearCart();
      router.push(`/orders/${data.id}?number=${encodeURIComponent(data.orderNumber)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Nothing to checkout</h1>
        <p className="mt-2 text-gray-500">Your cart is empty.</p>
        <Link href="/" className="mt-6 inline-block text-indigo-600 font-medium hover:text-indigo-500">
          ← Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/cart"
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-10">Checkout</h1>

      {user && (
        <p className="mb-6 text-sm text-gray-600 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3">
          Checking out as <strong>{user.name}</strong> — this order will be saved to your account.
        </p>
      )}

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6" key={user?.id ?? "guest"}>
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={user?.name ?? ""}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={user?.email ?? ""}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street address
                </label>
                <input
                  id="address"
                  name="address"
                  required
                  defaultValue={user?.address ?? ""}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  required
                  defaultValue={user?.city ?? ""}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP code
                </label>
                <input
                  id="zip"
                  name="zip"
                  required
                  defaultValue={user?.zip ?? ""}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-md px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white py-3 font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Place order · ${orderTotal.toFixed(2)}
              </>
            )}
          </button>
        </form>

        <aside className="lg:col-span-5 mt-10 lg:mt-0">
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 sticky top-24">
            <h2 className="font-medium text-gray-900 mb-4">Order summary</h2>
            <ul className="space-y-4 max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative h-14 w-14 rounded-md overflow-hidden bg-white shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 text-sm border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-600">
                <dt>Subtotal</dt>
                <dd>${totalPrice.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
              </div>
              <div className="flex justify-between text-gray-600">
                <dt>Tax</dt>
                <dd>${tax.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between font-medium text-gray-900 pt-2 border-t border-gray-200">
                <dt>Total</dt>
                <dd>${orderTotal.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
