/**
 * YARN palette — single source of truth for hex colours.
 * Edit values here → CSS variables, product swatches, and canvas trail all follow.
 */
export const palette = {
  ivory: '#f7f3eb',
  cream: '#f5f0e8',
  offWhite: '#faf7f2',
  surface: '#fffcf7',
  mutedPink: '#c9a9a6',
  dustyRose: '#b76e79',
  terracotta: '#c4785a',
  warmBrown: '#8b7355',
  sage: '#a8b5a0',
  butter: '#e8d5a3',
  ink: '#3d3229',
  inkSoft: '#5c4a3a',
  heroDeep: '#efe6d8',
} as const

export type PaletteKey = keyof typeof palette

/** Maps palette keys → CSS custom property names */
export const paletteCssVars: Record<PaletteKey, string> = {
  ivory: '--color-ivory',
  cream: '--color-cream',
  offWhite: '--color-off-white',
  surface: '--color-surface',
  mutedPink: '--color-muted-pink',
  dustyRose: '--color-dusty-rose',
  terracotta: '--color-terracotta',
  warmBrown: '--color-warm-brown',
  sage: '--color-sage',
  butter: '--color-butter',
  ink: '--color-ink',
  inkSoft: '--color-ink-soft',
  heroDeep: '--color-hero-deep',
}

/** Apply palette onto :root so CSS + canvas can read one source */
export function applyPaletteToDom(
  overrides: Partial<Record<PaletteKey, string>> = {},
): void {
  const root = document.documentElement
  ;(Object.keys(palette) as PaletteKey[]).forEach((key) => {
    const value = overrides[key] ?? palette[key]
    root.style.setProperty(paletteCssVars[key], value)
  })
}

export function readCssColor(cssVar: string, fallback = ''): string {
  if (typeof window === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(cssVar)
    .trim()
  return value || fallback
}

export function hexToRgba(hex: string, alpha: number): string {
  const cleaned = hex.replace('#', '')
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned
  const r = Number.parseInt(full.slice(0, 2), 16)
  const g = Number.parseInt(full.slice(2, 4), 16)
  const b = Number.parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
