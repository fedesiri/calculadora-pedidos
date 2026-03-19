"use client"

import { GIFT_ITEMS, type PriceType } from "@/lib/price-list"
import { QuantityControl } from "./quantity-control"

interface GiftItemCardProps {
  itemName: string
  priceType: PriceType
  quantity: number
  unitPriceOverride?: number
  onQuantityChange: (qty: number) => void
}

export function GiftItemCard({
  itemName,
  priceType,
  quantity,
  unitPriceOverride,
  onQuantityChange,
}: GiftItemCardProps) {
  const prices = GIFT_ITEMS[itemName]
  const hasItems = quantity > 0
  const unitPrice = unitPriceOverride ?? prices[priceType]

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        hasItems
          ? "border-primary/40 bg-card"
          : "border-border bg-card"
      }`}
    >
      <h2 className="mb-3 text-lg font-bold text-foreground">{itemName}</h2>
      <QuantityControl
        label="Unidad"
        price={unitPrice}
        quantity={quantity}
        onIncrement={() => onQuantityChange(quantity + 1)}
        onDecrement={() => onQuantityChange(Math.max(0, quantity - 1))}
        onBulkIncrement={() => onQuantityChange(quantity + 12)}
        onBulkDecrement={() => onQuantityChange(Math.max(0, quantity - 12))}
      />
    </div>
  )
}
