"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) router.push("/");
          throw new Error("Failed to fetch product");
        }
        setProduct(await res.json());
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id, router]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-8"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-3xl text-gray-900">${product.price.toFixed(2)}</p>

          <div className="mt-6">
            <p className="text-base text-gray-700 space-y-6">{product.description}</p>
          </div>

          <div className="mt-4 flex items-center">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
              {product.category}
            </span>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <label htmlFor="qty" className="text-sm font-medium text-gray-700">
              Quantity
            </label>
            <select
              id="qty"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-10 flex">
            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white sm:w-full transition-colors ${
                added ? "bg-green-600 hover:bg-green-700" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Added to Cart
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
