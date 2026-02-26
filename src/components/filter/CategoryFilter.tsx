"use client";

import { useFilterStore } from "@/stores/filterStore";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const { selectedCategoryIds, toggleCategory } = useFilterStore();

  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        카테고리
      </h3>
      <div className="space-y-1">
        {categories.map((cat) => {
          const isChecked = selectedCategoryIds.includes(cat.id);
          return (
            <label
              key={cat.id}
              className="flex items-center gap-2 cursor-pointer rounded-md px-2 py-1.5 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleCategory(cat.id)}
                className="sr-only"
              />
              <div
                className="h-3.5 w-3.5 rounded-sm border-2 flex items-center justify-center transition-colors"
                style={{
                  borderColor: cat.color,
                  backgroundColor: isChecked ? cat.color : "transparent",
                }}
              >
                {isChecked && (
                  <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-700">
                {cat.icon} {cat.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
