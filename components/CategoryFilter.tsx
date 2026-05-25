"use client";

const categories = ["All", "Electronics", "Accessories", "Apparel", "Home"];

interface CategoryFilterProps {
  active: string;
  onChange: (category: string) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
            active === cat
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-700"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
