import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartItem, Product } from '../types'

interface CartContextValue {
  items: CartItem[]
  count: number
  addItem: (product: Product, color?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clear: () => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'yarn-cart'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart())
  const [isOpen, setIsOpen] = useState(false)

  const persist = useCallback((next: CartItem[]) => {
    setItems(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const addItem = useCallback(
    (product: Product, color?: string) => {
      const existing = items.find((i) => i.product.id === product.id)
      if (existing) {
        persist(
          items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + 1, color: color ?? i.color }
              : i,
          ),
        )
      } else {
        persist([...items, { product, quantity: 1, color }])
      }
    },
    [items, persist],
  )

  const removeItem = useCallback(
    (productId: string) => {
      persist(items.filter((i) => i.product.id !== productId))
    },
    [items, persist],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        persist(items.filter((i) => i.product.id !== productId))
        return
      }
      persist(
        items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i,
        ),
      )
    },
    [items, persist],
  )

  const clear = useCallback(() => persist([]), [persist])

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      count,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      isOpen,
      setIsOpen,
    }),
    [items, count, addItem, removeItem, updateQuantity, clear, isOpen],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
