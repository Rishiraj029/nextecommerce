"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Hero from "@/components/Hero";
import AuthPanel from "@/components/AuthPanel";
import CategoryFilter from "@/components/CategoryFilter";
import type { Product } from "@/types";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        setProducts(await res.json());
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    if (category === "All") return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  return (
    <>
      <Hero />
      <div id="auth">
        <AuthPanel />
      </div>

      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Our collection
            </h2>
            <p className="mt-2 text-gray-500">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              {category !== "All" ? ` in ${category}` : ""}
            </p>
          </div>
          <CategoryFilter active={category} onChange={setCategory} />
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No products in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
