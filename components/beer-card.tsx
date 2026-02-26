"use client"

import { PRICE_LIST, type PriceType } from "@/lib/price-list"
import { QuantityControl } from "./quantity-control"

interface BeerCardProps {
  style: string
  priceType: PriceType
  litroQty: number
  medioQty: number
  onLitroChange: (qty: number) => void
  onMedioChange: (qty: number) => void
}

export function BeerCard({
  style,
  priceType,
  litroQty,
  medioQty,
  onLitroChange,
  onMedioChange,
}: BeerCardProps) {
  const prices = PRICE_LIST[style]
  const hasLitro = !!prices.litro
  const hasItems = litroQty > 0 || medioQty > 0

  return (
    <div
      className={`rounded-xl border p-4 transition-colors ${
        hasItems
          ? "border-primary/40 bg-card"
          : "border-border bg-card"
      }`}
    >
      <h2 className="mb-3 text-lg font-bold text-foreground">{style}</h2>
      <div className="flex flex-col gap-3">
        {hasLitro && (
          <>
            <QuantityControl
              label="1L"
              price={prices.litro![priceType]}
              quantity={litroQty}
              onIncrement={() => onLitroChange(litroQty + 1)}
              onDecrement={() => onLitroChange(Math.max(0, litroQty - 1))}
              onBulkIncrement={() => onLitroChange(litroQty + 12)}
              onBulkDecrement={() => onLitroChange(Math.max(0, litroQty - 12))}
            />
            <div className="h-px bg-border" />
          </>
        )}
        <QuantityControl
          label="500ml"
          price={prices.medio[priceType]}
          quantity={medioQty}
          onIncrement={() => onMedioChange(medioQty + 1)}
          onDecrement={() => onMedioChange(Math.max(0, medioQty - 1))}
          onBulkIncrement={() => onMedioChange(medioQty + 12)}
          onBulkDecrement={() => onMedioChange(Math.max(0, medioQty - 12))}
        />
      </div>
    </div>
  )
}
