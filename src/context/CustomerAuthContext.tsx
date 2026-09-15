import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  apiRequest,
  getCustomerToken,
  setCustomerToken,
} from '../services/api'
import type { CustomerProfile, OrderAddress } from '../types/orders'
import { EMPTY_ADDRESS } from '../types/orders'

export interface RegisterInput {
  email: string
  password: string
  name: string
  phone: string
  address: OrderAddress
}

export interface ProfileUpdateInput {
  name: string
  phone: string
  address: OrderAddress
}

interface CustomerAuthContextValue {
  customer: CustomerProfile | null
  ready: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: RegisterInput) => Promise<void>
  updateProfile: (input: ProfileUpdateInput) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
}

const CustomerAuthContext = createContext<CustomerAuthContextValue | null>(null)

function normalizeProfile(
  data: CustomerProfile & { token?: string },
): CustomerProfile {
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    phone: data.phone ?? '',
    address: {
      line1: data.address?.line1 ?? '',
      line2: data.address?.line2,
      city: data.address?.city ?? '',
      state: data.address?.state ?? '',
      postalCode: data.address?.postalCode ?? '',
      country: data.address?.country || EMPTY_ADDRESS.country,
    },
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [ready, setReady] = useState(false)

  const refresh = useCallback(async () => {
    const token = getCustomerToken()
    if (!token) {
      setCustomer(null)
      return
    }
    try {
      const me = await apiRequest<CustomerProfile>('/api/customers/me', {
        auth: true,
      })
      setCustomer(normalizeProfile(me))
    } catch {
      setCustomerToken(null)
      setCustomer(null)
    }
  }, [])

  useEffect(() => {
    refresh()
      .catch(console.error)
      .finally(() => setReady(true))
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    const result = await apiRequest<CustomerProfile & { token: string }>(
      '/api/customers/login',
      {
        method: 'POST',
        body: { email, password },
      },
    )
    setCustomerToken(result.token)
    setCustomer(normalizeProfile(result))
  }, [])

  const register = useCallback(async (input: RegisterInput) => {
    const result = await apiRequest<CustomerProfile & { token: string }>(
      '/api/customers/register',
      {
        method: 'POST',
        body: {
          ...input,
          address: {
            ...input.address,
            line2: input.address.line2 || undefined,
          },
        },
      },
    )
    setCustomerToken(result.token)
    setCustomer(normalizeProfile(result))
  }, [])

  const updateProfile = useCallback(async (input: ProfileUpdateInput) => {
    const result = await apiRequest<CustomerProfile>('/api/customers/me', {
      method: 'PATCH',
      auth: true,
      body: {
        ...input,
        address: {
          ...input.address,
          line2: input.address.line2 || undefined,
        },
      },
    })
    setCustomer(normalizeProfile(result))
  }, [])

  const logout = useCallback(() => {
    setCustomerToken(null)
    setCustomer(null)
  }, [])

  const value = useMemo(
    () => ({
      customer,
      ready,
      isAuthenticated: Boolean(customer),
      login,
      register,
      updateProfile,
      logout,
      refresh,
    }),
    [customer, ready, login, register, updateProfile, logout, refresh],
  )

  return (
    <CustomerAuthContext.Provider value={value}>
      {children}
    </CustomerAuthContext.Provider>
  )
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) {
    throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  }
  return ctx
}
