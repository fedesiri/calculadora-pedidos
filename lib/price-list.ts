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
    litro: { mayorista: 2940, minorista: 3630, fabrica: 2300 },
    medio: { mayorista: 1890, minorista: 2420, fabrica: 1400 },
  },
  Honey: {
    litro: { mayorista: 2940, minorista: 3630, fabrica: 2300 },
    medio: { mayorista: 1890, minorista: 2420, fabrica: 1400 },
  },
  "Red Ale": {
    litro: { mayorista: 2940, minorista: 3630, fabrica: 2300 },
    medio: { mayorista: 1890, minorista: 2420, fabrica: 1400 },
  },
  "Cream Stout": {
    litro: { mayorista: 2940, minorista: 3630, fabrica: 2300 },
    medio: { mayorista: 1890, minorista: 2420, fabrica: 1400 },
  },
  Frambuesa: {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Session Ipa": {
    litro: { mayorista: 3465, minorista: 4290, fabrica: 2700 },
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Doble Ipa": {
    litro: { mayorista: 3465, minorista: 4290, fabrica: 2700 },
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Ipa Argenta": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Ipa Whisky": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "H. Maracuya": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Trigo": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Oud bruin": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Nibs & wood": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Wheat wine": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Ipa Maracuya": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
  "Imperial Stout": {
    medio: { mayorista: 2205, minorista: 2970, fabrica: 1690 },
  },
}

export const BEER_STYLES = Object.keys(PRICE_LIST)

// Productos (combos) de estuches
export const GIFT_ITEMS: Record<string, SizePrices> = {
  "Estuche/Copa": { mayorista: 7500, minorista: 7500, fabrica: 5100 },
  "Estuche/Vaso": { mayorista: 4700, minorista: 4700, fabrica: 3200 },
}

export const GIFT_ITEM_NAMES = Object.keys(GIFT_ITEMS)

/** Productos extra con variantes (ej. Vasos 350ml / 500ml / Copas): cada variante tiene sus precios */
export type VariantItem = Record<string, SizePrices>

export const VARIANT_ITEMS: Record<string, VariantItem> = {
  Vasos: {
    "350ml": { mayorista: 2000, minorista: 2000, fabrica: 1900 }, // proporción Golden medio (1750/1330, 2200/1330)
    // "500ml (pinta)": { mayorista: 2700, minorista: 3000, fabrica: 1900 }, // descomentar y ajustar cuando tengas
    Copas: { mayorista: 5000, minorista: 5000, fabrica: 3800 }, // descomentar y ajustar cuando tengas
  },
}

// si compras mas de 50k los estuches te queda con alguna promo (pendiente de definir).

export const VARIANT_ITEM_NAMES = Object.keys(VARIANT_ITEMS)

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  mayorista: "Mayorista",
  minorista: "Minorista",
  fabrica: "Fabrica",
}
