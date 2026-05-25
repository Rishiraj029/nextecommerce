import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-sm font-medium text-indigo-600 mb-1">{product.category}</p>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
