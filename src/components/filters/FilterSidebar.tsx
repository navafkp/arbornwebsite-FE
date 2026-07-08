"use client";

import { categories } from "@/lib/data/categories";
import { getAllColors, getAllSizes } from "@/lib/data/products";
import { PRICE_PRESETS } from "@/lib/constants";
import type { Size } from "@/lib/types";
import ColorSwatch from "@/components/ui/ColorSwatch";
import { cn } from "@/lib/utils";

export interface ProductFilters {
  categories: string[];
  pricePreset: string | null;
  sizes: Size[];
  colors: string[];
  inStockOnly: boolean;
}

export const EMPTY_FILTERS: ProductFilters = {
  categories: [],
  pricePreset: null,
  sizes: [],
  colors: [],
  inStockOnly: false,
};

interface FilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const allColors = getAllColors();
  const allSizes = getAllSizes();
  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    filters.colors.length +
    (filters.pricePreset ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-wide">Filters</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="text-xs text-[var(--muted)] underline underline-offset-2 hover:text-black"
          >
            Clear all
          </button>
        )}
      </div>

      <fieldset>
        <legend className="mb-3 text-xs font-medium tracking-widest text-black uppercase">
          Category
        </legend>
        <div className="flex flex-col gap-2.5">
          {categories.map((category) => (
            <label key={category.slug} className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={filters.categories.includes(category.slug)}
                onChange={() =>
                  onChange({
                    ...filters,
                    categories: toggle(filters.categories, category.slug),
                  })
                }
                className="h-3.5 w-3.5 accent-[var(--accent)]"
              />
              {category.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium tracking-widest text-black uppercase">
          Price
        </legend>
        <div className="flex flex-col gap-2.5">
          {PRICE_PRESETS.map((preset) => (
            <label key={preset.key} className="flex items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="price"
                checked={filters.pricePreset === preset.key}
                onChange={() =>
                  onChange({
                    ...filters,
                    pricePreset: filters.pricePreset === preset.key ? null : preset.key,
                  })
                }
                className="h-3.5 w-3.5 accent-[var(--accent)]"
              />
              {preset.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium tracking-widest text-black uppercase">
          Size
        </legend>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onChange({ ...filters, sizes: toggle(filters.sizes, size) })}
              className={cn(
                "h-8 min-w-8 rounded-full border px-2.5 text-xs transition",
                filters.sizes.includes(size)
                  ? "border-accent bg-accent text-white"
                  : "border-black/15 text-black hover:border-black/40",
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium tracking-widest text-black uppercase">
          Color
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {allColors.map((color) => (
            <ColorSwatch
              key={color.name}
              hex={color.hex}
              name={color.name}
              size="md"
              selected={filters.colors.includes(color.name)}
              onClick={() => onChange({ ...filters, colors: toggle(filters.colors, color.name) })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-3 text-xs font-medium tracking-widest text-black uppercase">
          Availability
        </legend>
        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
            className="h-3.5 w-3.5 accent-[var(--accent)]"
          />
          In Stock Only
        </label>
      </fieldset>
    </div>
  );
}
