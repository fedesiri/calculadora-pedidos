"use client"

import { VARIANT_ITEMS, type PriceType } from "@/lib/price-list"
import { QuantityControl } from "./quantity-control"

interface VariantItemCardProps {
  itemName: string
  priceType: PriceType
  variantQuantities: Record<string, number>
  onVariantChange: (variant: string, qty: number) => void
}

export function VariantItemCard({
  itemName,
  priceType,
  variantQuantities,
  onVariantChange,
}: VariantItemCardProps) {
  const variants = VARIANT_ITEMS[itemName]
  const variantNames = Object.keys(variants)
  const hasItems = variantNames.some((v) => (variantQuantities[v] ?? 0) > 0)

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        hasItems
          ? "border-primary/40 bg-card"
          : "border-border bg-card"
      }`}
    >
      <h2 className="mb-3 text-lg font-bold text-foreground">{itemName}</h2>
      <div className="flex flex-col gap-3">
        {variantNames.map((variant, i) => (
          <div key={variant}>
            {i > 0 && <div className="h-px bg-border" />}
            <div className={i > 0 ? "mt-3" : ""}>
              <QuantityControl
                label={variant}
                price={variants[variant][priceType]}
                quantity={variantQuantities[variant] ?? 0}
                onIncrement={() =>
                  onVariantChange(variant, (variantQuantities[variant] ?? 0) + 1)
                }
                onDecrement={() =>
                  onVariantChange(
                    variant,
                    Math.max(0, (variantQuantities[variant] ?? 0) - 1)
                  )
                }
                onBulkIncrement={() =>
                  onVariantChange(variant, (variantQuantities[variant] ?? 0) + 12)
                }
                onBulkDecrement={() =>
                  onVariantChange(
                    variant,
                    Math.max(0, (variantQuantities[variant] ?? 0) - 12)
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
