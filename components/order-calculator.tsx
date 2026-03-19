"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { Search, X } from "lucide-react"
import {
  PRICE_LIST,
  BEER_STYLES,
  GIFT_ITEMS,
  GIFT_ITEM_NAMES,
  VARIANT_ITEMS,
  VARIANT_ITEM_NAMES,
  PRICE_TYPE_LABELS,
  type PriceType,
} from "@/lib/price-list"
import { PriceSelector } from "./price-selector"
import { BeerCard } from "./beer-card"
import { GiftItemCard } from "./gift-item-card"
import { VariantItemCard } from "./variant-item-card"
import { StickyFooter } from "./sticky-footer"

type Quantities = Record<string, { litro: number; medio: number }>
type GiftQuantities = Record<string, number>
/** Por producto (ej. Vasos) -> por variante (ej. 350ml) -> cantidad */
type VariantQuantities = Record<string, Record<string, number>>

function getInitialQuantities(): Quantities {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("beer-quantities")
      if (stored) return JSON.parse(stored)
    } catch {}
  }
  return BEER_STYLES.reduce((acc, style) => {
    acc[style] = { litro: 0, medio: 0 }
    return acc
  }, {} as Quantities)
}

function getInitialGiftQuantities(): GiftQuantities {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("gift-quantities")
      if (stored) return JSON.parse(stored)
    } catch {}
  }
  return GIFT_ITEM_NAMES.reduce((acc, name) => {
    acc[name] = 0
    return acc
  }, {} as GiftQuantities)
}

function getInitialVariantQuantities(): VariantQuantities {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("variant-quantities")
      if (stored) {
        const parsed = JSON.parse(stored) as VariantQuantities
        // Asegurar que nuevas variantes que agregues en price-list tengan 0
        const merged: VariantQuantities = {}
        VARIANT_ITEM_NAMES.forEach((itemName) => {
          merged[itemName] = { ...parsed[itemName] }
          Object.keys(VARIANT_ITEMS[itemName]).forEach((variant) => {
            if (merged[itemName][variant] === undefined) merged[itemName][variant] = 0
          })
        })
        return merged
      }
    } catch {}
  }
  return VARIANT_ITEM_NAMES.reduce((acc, itemName) => {
    acc[itemName] = Object.keys(VARIANT_ITEMS[itemName]).reduce((a, v) => {
      a[v] = 0
      return a
    }, {} as Record<string, number>)
    return acc
  }, {} as VariantQuantities)
}

function getInitialPriceType(): PriceType {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("beer-price-type")
      if (stored && ["mayorista", "minorista", "fabrica"].includes(stored)) {
        return stored as PriceType
      }
    } catch {}
  }
  return "mayorista"
}

function getInitialCustomerName(): string {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("order-customer-name") ?? ""
    } catch {}
  }
  return ""
}

export function OrderCalculator() {
  const [priceType, setPriceType] = useState<PriceType>(getInitialPriceType)
  const [customerName, setCustomerName] = useState(getInitialCustomerName)
  const [quantities, setQuantities] = useState<Quantities>(getInitialQuantities)
  const [giftQuantities, setGiftQuantities] = useState<GiftQuantities>(getInitialGiftQuantities)
  const [variantQuantities, setVariantQuantities] = useState<VariantQuantities>(getInitialVariantQuantities)
  const [search, setSearch] = useState("")
  const [mounted, setMounted] = useState(false)

  const filteredStyles = useMemo(() => {
    if (!search.trim()) return BEER_STYLES
    const term = search.toLowerCase().trim()
    return BEER_STYLES.filter((style) => style.toLowerCase().includes(term))
  }, [search])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("beer-price-type", priceType)
    }
  }, [priceType, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("order-customer-name", customerName)
    }
  }, [customerName, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("beer-quantities", JSON.stringify(quantities))
    }
  }, [quantities, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("gift-quantities", JSON.stringify(giftQuantities))
    }
  }, [giftQuantities, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("variant-quantities", JSON.stringify(variantQuantities))
    }
  }, [variantQuantities, mounted])

  const updateQuantity = useCallback(
    (style: string, size: "litro" | "medio", qty: number) => {
      setQuantities((prev) => ({
        ...prev,
        [style]: { ...prev[style], [size]: qty },
      }))
    },
    []
  )

  const beerTotal = BEER_STYLES.reduce((sum, style) => {
    const q = quantities[style]
    if (!q) return sum
    const prices = PRICE_LIST[style]
    const litroTotal = prices.litro ? q.litro * prices.litro[priceType] : 0
    return sum + litroTotal + q.medio * prices.medio[priceType]
  }, 0)

  const variantTotal = VARIANT_ITEM_NAMES.reduce((sum, itemName) => {
    const variants = VARIANT_ITEMS[itemName]
    return sum + Object.keys(variants).reduce((s, variant) => {
      const qty = variantQuantities[itemName]?.[variant] ?? 0
      return s + qty * variants[variant][priceType]
    }, 0)
  }, 0)

  // Promo: si la COMPRA de CERVEZA supera 50k, `Estuche/Copa` pasa a $6500
  // (solo para mayorista/minorista).
  const promoApplies = priceType !== "fabrica" && beerTotal > 50000

  const giftTotal = GIFT_ITEM_NAMES.reduce((sum, name) => {
    const qty = giftQuantities[name] ?? 0
    const unitPrice =
      name === "Estuche/Copa" && promoApplies ? 6500 : GIFT_ITEMS[name][priceType]
    return sum + qty * unitPrice
  }, 0)

  const total = beerTotal + giftTotal + variantTotal

  const hasItems =
    BEER_STYLES.some((style) => {
      const q = quantities[style]
      return q && (q.litro > 0 || q.medio > 0)
    }) ||
    GIFT_ITEM_NAMES.some((name) => (giftQuantities[name] ?? 0) > 0) ||
    VARIANT_ITEM_NAMES.some((itemName) =>
      Object.keys(variantQuantities[itemName] ?? {}).some(
        (v) => (variantQuantities[itemName]?.[v] ?? 0) > 0
      )
    )

  const updateGiftQuantity = useCallback((itemName: string, qty: number) => {
    setGiftQuantities((prev) => ({ ...prev, [itemName]: qty }))
  }, [])

  const updateVariantQuantity = useCallback(
    (itemName: string, variant: string, qty: number) => {
      setVariantQuantities((prev) => ({
        ...prev,
        [itemName]: { ...(prev[itemName] ?? {}), [variant]: qty },
      }))
    },
    []
  )

  const handleCopy = useCallback(() => {
    const nameLine = customerName.trim() ? `Pedido para: ${customerName.trim()}` : "Pedido"
    const parts: string[] = [nameLine, "", `Precio: ${PRICE_TYPE_LABELS[priceType].toUpperCase()}`, ""]

    // LITRO: cervezas con litro
    const litroLines: { style: string; qty: number; subtotal: number }[] = []
    BEER_STYLES.forEach((style) => {
      const q = quantities[style]
      const prices = PRICE_LIST[style]
      if (!q?.litro || q.litro <= 0 || !prices.litro) return
      const subtotal = q.litro * prices.litro[priceType]
      litroLines.push({ style, qty: q.litro, subtotal })
    })
    litroLines.sort((a, b) => b.qty - a.qty)
    if (litroLines.length > 0) {
      parts.push("LITRO")
      litroLines.forEach(({ style, qty, subtotal }) => {
        parts.push(`- ${qty} ${style.toLowerCase()} de litro --> ${subtotal}`)
      })
      parts.push("")
    }

    // MEDIO: cervezas 500ml
    const medioLines: { style: string; qty: number; subtotal: number }[] = []
    BEER_STYLES.forEach((style) => {
      const q = quantities[style]
      const prices = PRICE_LIST[style]
      if (!q?.medio || q.medio <= 0) return
      const subtotal = q.medio * prices.medio[priceType]
      medioLines.push({ style, qty: q.medio, subtotal })
    })
    medioLines.sort((a, b) => b.qty - a.qty)
    if (medioLines.length > 0) {
      parts.push("MEDIO")
      medioLines.forEach(({ style, qty, subtotal }) => {
        parts.push(`- ${qty} ${style.toLowerCase()} de medio --> ${subtotal}`)
      })
      parts.push("")
    }

    // Productos extra (Estuche, etc.)
    const extraLines: string[] = []
    GIFT_ITEM_NAMES.forEach((name) => {
      const qty = giftQuantities[name] ?? 0
      if (qty <= 0) return
      const unitPrice =
        name === "Estuche/Copa" && promoApplies ? 6500 : GIFT_ITEMS[name][priceType]
      const subtotal = qty * unitPrice
      extraLines.push(`- ${qty} ${name.toLowerCase()} --> ${subtotal}`)
    })
    VARIANT_ITEM_NAMES.forEach((itemName) => {
      const qs = variantQuantities[itemName] ?? {}
      Object.keys(VARIANT_ITEMS[itemName]).forEach((variant) => {
        const qty = qs[variant] ?? 0
        if (qty <= 0) return
        const subtotal = qty * VARIANT_ITEMS[itemName][variant][priceType]
        extraLines.push(`- ${qty} ${itemName.toLowerCase()} ${variant} --> ${subtotal}`)
      })
    })
    if (extraLines.length > 0) {
      parts.push("PRODUCTOS EXTRA")
      parts.push(...extraLines)
      parts.push("")
    }

    parts.push("-------------------")
    parts.push(`Total $${total.toLocaleString("es-AR")}`)

    const text = parts.join("\n")

    navigator.clipboard.writeText(text).then(() => {
      if (navigator.vibrate) navigator.vibrate(30)
      toast.success("Pedido copiado")
    }).catch(() => {
      toast.error("No se pudo copiar")
    })
  }, [quantities, giftQuantities, variantQuantities, priceType, total, promoApplies, customerName])

  const handleClear = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(30)
    setCustomerName("")
    setQuantities(
      BEER_STYLES.reduce((acc, style) => {
        acc[style] = { litro: 0, medio: 0 }
        return acc
      }, {} as Quantities)
    )
    setGiftQuantities(
      GIFT_ITEM_NAMES.reduce((acc, name) => {
        acc[name] = 0
        return acc
      }, {} as GiftQuantities)
    )
    setVariantQuantities(
      VARIANT_ITEM_NAMES.reduce((acc, itemName) => {
        acc[itemName] = Object.keys(VARIANT_ITEMS[itemName]).reduce(
          (a, v) => ({ ...a, [v]: 0 }),
          {} as Record<string, number>
        )
        return acc
      }, {} as VariantQuantities)
    )
  }, [])

  const handleNewOrder = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(30)
    setCustomerName("")
    setQuantities(
      BEER_STYLES.reduce((acc, style) => {
        acc[style] = { litro: 0, medio: 0 }
        return acc
      }, {} as Quantities)
    )
    setGiftQuantities(
      GIFT_ITEM_NAMES.reduce((acc, name) => {
        acc[name] = 0
        return acc
      }, {} as GiftQuantities)
    )
    setVariantQuantities(
      VARIANT_ITEM_NAMES.reduce((acc, itemName) => {
        acc[itemName] = Object.keys(VARIANT_ITEMS[itemName]).reduce(
          (a, v) => ({ ...a, [v]: 0 }),
          {} as Record<string, number>
        )
        return acc
      }, {} as VariantQuantities)
    )
    setPriceType("mayorista")
    toast("Nuevo pedido")
  }, [])

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-36">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="mb-3 text-lg font-bold text-foreground">
            Calculadora de Pedidos
          </h1>
          <div className="mb-3">
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Nombre del cliente (opcional)"
              className="h-9 w-full rounded-lg border border-border bg-input px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <PriceSelector selected={priceType} onSelect={setPriceType} />
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cerveza..."
              className="h-10 w-full rounded-lg border border-border bg-input pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Limpiar busqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4">
        <div className="flex flex-col gap-3">
          {filteredStyles.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
              <Search className="h-8 w-8" />
              <p className="text-sm">No se encontraron cervezas</p>
            </div>
          ) : (
            filteredStyles.map((style) => (
              <BeerCard
                key={style}
                style={style}
                priceType={priceType}
                litroQty={quantities[style]?.litro ?? 0}
                medioQty={quantities[style]?.medio ?? 0}
                onLitroChange={(qty) => updateQuantity(style, "litro", qty)}
                onMedioChange={(qty) => updateQuantity(style, "medio", qty)}
              />
            ))
          )}

          {GIFT_ITEM_NAMES.length > 0 && (
            <>
              <h2 className="mt-4 text-sm font-semibold text-muted-foreground">
                Productos extra
              </h2>
              {GIFT_ITEM_NAMES.map((name) => (
                <GiftItemCard
                  key={name}
                  itemName={name}
                  priceType={priceType}
                  quantity={giftQuantities[name] ?? 0}
                  unitPriceOverride={
                    name === "Estuche/Copa" && promoApplies ? 6500 : undefined
                  }
                  onQuantityChange={(qty) => updateGiftQuantity(name, qty)}
                />
              ))}
              {VARIANT_ITEM_NAMES.map((itemName) => (
                <VariantItemCard
                  key={itemName}
                  itemName={itemName}
                  priceType={priceType}
                  variantQuantities={variantQuantities[itemName] ?? {}}
                  onVariantChange={(variant, qty) =>
                    updateVariantQuantity(itemName, variant, qty)
                  }
                />
              ))}
            </>
          )}
        </div>
      </main>

      <StickyFooter
        total={total}
        hasItems={hasItems}
        onCopy={handleCopy}
        onClear={handleClear}
        onNewOrder={handleNewOrder}
      />
    </div>
  )
}
