"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuantityControlProps {
  label: string
  price: number
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  onBulkIncrement: () => void
  onBulkDecrement: () => void
}

function vibrate() {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(15)
  }
}

export function QuantityControl({
  label,
  price,
  quantity,
  onIncrement,
  onDecrement,
  onBulkIncrement,
  onBulkDecrement,
}: QuantityControlProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col min-w-[70px]">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs font-mono text-muted-foreground">
          {"$"}
          {price.toLocaleString("es-AR")}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => {
            vibrate()
            onBulkDecrement()
          }}
          disabled={quantity < 12}
          className={cn(
            "flex h-12 w-10 items-center justify-center rounded-lg",
            "bg-secondary text-foreground font-mono text-xs font-bold transition-all active:scale-90 select-none",
            "disabled:opacity-30 disabled:active:scale-100"
          )}
          aria-label={`Restar 12 ${label}`}
        >
          -12
        </button>
        <button
          onClick={() => {
            vibrate()
            onDecrement()
          }}
          disabled={quantity === 0}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            "bg-secondary text-foreground transition-all active:scale-90 select-none",
            "disabled:opacity-30 disabled:active:scale-100"
          )}
          aria-label={`Restar ${label}`}
        >
          <Minus className="h-5 w-5" />
        </button>
        <span
          className={cn(
            "min-w-[44px] text-center font-mono text-2xl font-bold tabular-nums",
            quantity > 0 ? "text-primary" : "text-muted-foreground"
          )}
        >
          {quantity}
        </span>
        <button
          onClick={() => {
            vibrate()
            onIncrement()
          }}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg",
            "bg-primary text-primary-foreground transition-all active:scale-90 select-none"
          )}
          aria-label={`Sumar ${label}`}
        >
          <Plus className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            vibrate()
            onBulkIncrement()
          }}
          className={cn(
            "flex h-12 w-10 items-center justify-center rounded-lg",
            "bg-primary text-primary-foreground font-mono text-xs font-bold transition-all active:scale-90 select-none"
          )}
          aria-label={`Sumar 12 ${label}`}
        >
          +12
        </button>
      </div>
    </div>
  )
}
