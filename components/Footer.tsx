import Link from "next/link";
import { Store } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <Link href="/" className="flex items-center gap-2 text-gray-900">
              <Store className="h-5 w-5 text-indigo-600" />
              <span className="font-bold">ModernShop</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Full-stack ecommerce project — Next.js, MongoDB, REST API, optional auth.
            </p>
          </div>
          <div className="flex gap-10 text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600">
              Shop
            </Link>
            <Link href="/cart" className="hover:text-indigo-600">
              Cart
            </Link>
            <Link href="/account" className="hover:text-indigo-600">
              Account
            </Link>
          </div>
        </div>
        <p className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} ModernShop — Software engineering portfolio project
        </p>
      </div>
    </footer>
  );
}
