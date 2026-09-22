import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CustomOrderForm, Product, SiteContent } from '../types'
import { siteContent as seedContent } from '../data/content'
import { products as seedProducts } from '../data/products'
import { apiRequest, ApiError } from '../services/api'
import { mediaUrl } from '../utils/mediaUrl'

interface StorefrontContextValue {
  products: Product[]
  content: SiteContent
  loading: boolean
  error: string | null
  getProductBySlug: (slug: string) => Product | undefined
  getFeaturedProducts: () => Product[]
  getCollectionProducts: () => Product[]
  submitCustomRequest: (form: CustomOrderForm) => Promise<void>
  refresh: () => Promise<void>
}

const StorefrontContext = createContext<StorefrontContextValue | null>(null)

function normalizeProduct(product: Product & { status?: string }): Product {
  const rawImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : []
  const images = rawImages.map((src) => mediaUrl(src)).filter(Boolean)
  const image = images[0] ?? mediaUrl(product.image)
  return {
    ...product,
    image,
    images,
  }
}

function normalizeContent(raw: SiteContent): SiteContent {
  return {
    ...raw,
    brand: { ...raw.brand, logoSrc: mediaUrl(raw.brand.logoSrc) },
    hero: { ...raw.hero, image: mediaUrl(raw.hero.image) },
    maker: { ...raw.maker, image: mediaUrl(raw.maker.image) },
    process: {
      ...raw.process,
      steps: raw.process.steps.map((step) => ({
        ...step,
        image: step.image ? mediaUrl(step.image) : step.image,
      })),
    },
    gallery: {
      ...raw.gallery,
      items: raw.gallery.items.map((item) => ({
        ...item,
        image: mediaUrl(item.image),
      })),
    },
    instagram: {
      ...raw.instagram,
      qrImage: mediaUrl(raw.instagram.qrImage),
    },
  }
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    seedProducts.map((p) => normalizeProduct(p)),
  )
  const [content, setContent] = useState<SiteContent>(() =>
    normalizeContent(seedContent),
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [apiProducts, apiContent] = await Promise.all([
        apiRequest<(Product & { status?: string })[]>('/api/products'),
        apiRequest<SiteContent>('/api/content'),
      ])
      setProducts(apiProducts.map(normalizeProduct))
      setContent(normalizeContent(apiContent))
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Could not reach the Yarn API — showing local seed.'
      setError(message)
      setProducts(seedProducts.map((p) => normalizeProduct(p)))
      setContent(normalizeContent(seedContent))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh().catch(console.error)
  }, [refresh])

  const getProductBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  )

  const getFeaturedProducts = useCallback(
    () => products.filter((p) => p.featured),
    [products],
  )

  const getCollectionProducts = useCallback(
    () => products.filter((p) => p.showInCollection),
    [products],
  )

  const submitCustomRequest = useCallback(async (form: CustomOrderForm) => {
    await apiRequest('/api/custom-requests', {
      method: 'POST',
      body: {
        name: form.name,
        idea: form.idea,
        colours: form.colours,
        message: form.message,
      },
    })
  }, [])

  const value = useMemo(
    () => ({
      products,
      content,
      loading,
      error,
      getProductBySlug,
      getFeaturedProducts,
      getCollectionProducts,
      submitCustomRequest,
      refresh,
    }),
    [
      products,
      content,
      loading,
      error,
      getProductBySlug,
      getFeaturedProducts,
      getCollectionProducts,
      submitCustomRequest,
      refresh,
    ],
  )

  return (
    <StorefrontContext.Provider value={value}>
      {children}
    </StorefrontContext.Provider>
  )
}

export function useStorefront() {
  const ctx = useContext(StorefrontContext)
  if (!ctx) {
    throw new Error('useStorefront must be used within StorefrontProvider')
  }
  return ctx
}
