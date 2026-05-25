"use client";

import Link from "next/link";
import { ShoppingCart, Store, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Store className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              ModernShop
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  href="/account"
                  className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                  <User className="h-4 w-4" />
                  {user.name.split(" ")[0]}
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-500 hover:text-gray-800"
                >
                  Sign out
                </button>
              </>
            ) : (
              <a
                href="#auth"
                className="hidden sm:block text-sm font-medium text-gray-600 hover:text-indigo-600"
              >
                Sign in
              </a>
            )}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
