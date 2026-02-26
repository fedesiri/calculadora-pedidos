"use client"

import { Copy, Trash2, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface StickyFooterProps {
  total: number
  hasItems: boolean
  onCopy: () => void
  onClear: () => void
  onNewOrder: () => void
}

export function StickyFooter({
  total,
  hasItems,
  onCopy,
  onClear,
  onNewOrder,
}: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto max-w-lg px-4 py-3">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Total
          </span>
          <span
            className={cn(
              "text-3xl font-mono font-bold tabular-nums transition-colors",
              total > 0 ? "text-primary" : "text-muted-foreground"
            )}
          >
            {"$"}
            {total.toLocaleString("es-AR")}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onNewOrder}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              "bg-secondary text-muted-foreground transition-all active:scale-90 select-none"
            )}
            aria-label="Nuevo pedido"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          <button
            onClick={onClear}
            disabled={!hasItems}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg",
              "bg-secondary text-muted-foreground transition-all active:scale-90 select-none",
              "disabled:opacity-30 disabled:active:scale-100"
            )}
            aria-label="Limpiar"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={onCopy}
            disabled={!hasItems}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-lg",
              "bg-primary text-primary-foreground font-semibold transition-all active:scale-[0.97] select-none",
              "disabled:opacity-30 disabled:active:scale-100"
            )}
          >
            <Copy className="h-5 w-5" />
            Copiar pedido
          </button>
        </div>
      </div>
    </div>
  )
}
