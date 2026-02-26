"use client"

import { type PriceType, PRICE_TYPE_LABELS } from "@/lib/price-list"
import { cn } from "@/lib/utils"

const PRICE_TYPES: PriceType[] = ["mayorista", "minorista", "fabrica"]

interface PriceSelectorProps {
  selected: PriceType
  onSelect: (type: PriceType) => void
}

export function PriceSelector({ selected, onSelect }: PriceSelectorProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-secondary p-1">
      {PRICE_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className={cn(
            "flex-1 rounded-md px-3 py-3 text-sm font-semibold transition-all min-h-[48px]",
            "active:scale-95 select-none",
            selected === type
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {PRICE_TYPE_LABELS[type]}
        </button>
      ))}
    </div>
  )
}
