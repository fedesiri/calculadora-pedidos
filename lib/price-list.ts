export type PriceType = "mayorista" | "minorista" | "fabrica"

export type SizePrices = {
  mayorista: number
  minorista: number
  fabrica: number
}

export type BeerStyle = {
  litro?: SizePrices  // opcional: no todos los estilos vienen en 1L
  medio: SizePrices
}

export const PRICE_LIST: Record<string, BeerStyle> = {
  Golden: {
    litro: { mayorista: 2750, minorista: 3100, fabrica: 2150 },
    medio: { mayorista: 1750, minorista: 2100, fabrica: 1330 },
  },
  Honey: {
    litro: { mayorista: 2750, minorista: 3100, fabrica: 2150 },
    medio: { mayorista: 1750, minorista: 2100, fabrica: 1330 },
  },
  "Red Ale": {
    litro: { mayorista: 2750, minorista: 3100, fabrica: 2150 },
    medio: { mayorista: 1750, minorista: 2100, fabrica: 1330 },
  },
  "Cream Stout": {
    litro: { mayorista: 2750, minorista: 3100, fabrica: 2150 },
    medio: { mayorista: 1750, minorista: 2100, fabrica: 1330 },
  },
  Frambuesa: {
    medio: { mayorista: 2062.5, minorista: 2500, fabrica: 1560 },
  },
  "Session Ipa": {
    litro: { mayorista: 3250, minorista: 3700, fabrica: 2550 },
    medio: { mayorista: 2062.5, minorista: 2500, fabrica: 1560 },
  },
  "Doble Ipa": {
    litro: { mayorista: 3250, minorista: 3700, fabrica: 2550 },
    medio: { mayorista: 2062.5, minorista: 2500, fabrica: 1560 },
  },
  "Ipa Argenta": {
    medio: { mayorista: 2062.5, minorista: 2500, fabrica: 1560 },
  },
  "Ipa Whisky": {
    medio: { mayorista: 2062.5, minorista: 2500, fabrica: 1560 },
  },
  "H. Maracuya": {
    medio: { mayorista: 2062.5, minorista: 2500, fabrica: 1560 },
  },

  
}

export const BEER_STYLES = Object.keys(PRICE_LIST)


export const GIFT_ITEMS: Record<string, SizePrices> = {
  Estuche: { mayorista: 1700, minorista: 2000, fabrica: 1300 }, // proporción sobre Golden medio (1750/1330, 2100/1330)
}

export const GIFT_ITEM_NAMES = Object.keys(GIFT_ITEMS)

/** Productos extra con variantes (ej. Vasos 350ml / 500ml / Copas): cada variante tiene sus precios */
export type VariantItem = Record<string, SizePrices>

export const VARIANT_ITEMS: Record<string, VariantItem> = {
  Vasos: {
    "350ml": { mayorista: 2500, minorista: 3000, fabrica: 1900 }, // proporción Golden medio (1750/1330, 2100/1330)
    // "500ml (pinta)": { mayorista: 2500, minorista: 3000, fabrica: 1900 }, // descomentar y ajustar cuando tengas
    // Copas: { mayorista: 2500, minorista: 3000, fabrica: 1900 }, // descomentar y ajustar cuando tengas
  },
}

export const VARIANT_ITEM_NAMES = Object.keys(VARIANT_ITEMS)

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  mayorista: "Mayorista",
  minorista: "Minorista",
  fabrica: "Fabrica",
}
