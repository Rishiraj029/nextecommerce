"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  const shipping = totalPrice > 75 ? 0 : 5.99;
  const tax = Math.round(totalPrice * 0.08 * 100) / 100;
  const orderTotal = Math.round((totalPrice + shipping + tax) * 100) / 100;

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <p className="mt-4 text-gray-500">Your cart is currently empty.</p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10">
        Shopping Cart
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          <ul className="border-t border-b border-gray-200 divide-y divide-gray-200 bg-white rounded-lg">
            {cart.map((item) => (
              <li key={item.id} className="flex py-6 sm:py-10 px-4 sm:px-6">
                <div className="flex-shrink-0">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-32 sm:w-32">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                </div>

                <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <Link
                        href={`/product/${item.id}`}
                        className="font-medium text-gray-700 hover:text-gray-800"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                      <p className="mt-1 text-sm font-medium text-gray-900">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="flex items-center border border-gray-300 rounded-md w-fit">
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-500 disabled:opacity-50"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 text-gray-900 font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="p-2 text-gray-600 hover:text-gray-500"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="absolute top-0 right-0">
                        <button
                          type="button"
                          className="-m-2 p-2 inline-flex text-gray-400 hover:text-gray-500"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <section className="mt-16 bg-gray-50 rounded-lg px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Subtotal</dt>
              <dd className="text-sm font-medium text-gray-900">${totalPrice.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Shipping estimate</dt>
              <dd className="text-sm font-medium text-gray-900">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </dd>
            </div>
            {totalPrice <= 75 && (
              <p className="text-xs text-indigo-600">
                Add ${(75.01 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-sm text-gray-600">Tax estimate</dt>
              <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <dt className="text-base font-medium text-gray-900">Order total</dt>
              <dd className="text-base font-medium text-gray-900">${orderTotal.toFixed(2)}</dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            className="mt-6 w-full flex justify-center items-center gap-2 bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700"
          >
            Checkout <ArrowRight className="h-5 w-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
