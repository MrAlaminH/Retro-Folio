"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getCategoryDisplayName } from "@/data/gallery-data";

interface GalleryNavProps {
  categories: string[];
}

export default function GalleryNav({ categories }: GalleryNavProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <nav className="mb-8 pb-6 border-b border-green-500/30 dark:border-green-500/30">
      <p className="text-xs text-green-600 dark:text-green-400 mb-3 font-semibold text-center">
        CATEGORIES:
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          const displayName = getCategoryDisplayName(category);

          return (
            <Link
              key={category}
              href={`/gallery?category=${category}`}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border rounded ${
                isActive
                  ? "bg-green-500 dark:bg-green-500 text-white border-green-500 dark:border-green-500"
                  : "bg-transparent text-green-600 dark:text-green-400 border-green-500/50 dark:border-green-500/50 hover:bg-green-500/10 dark:hover:bg-green-500/10 hover:border-green-500 dark:hover:border-green-500"
              }`}
            >
              {displayName}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
