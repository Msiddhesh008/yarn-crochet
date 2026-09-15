function requireApiUrl(): string {
  const raw = import.meta.env.VITE_API_URL
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error(
      'VITE_API_URL is required. Set it in Client/.env (see .env.example).',
    )
  }
  return raw.replace(/\/$/, '')
}

const API_URL = requireApiUrl()

const TOKEN_KEY = 'yarn-customer:token'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getApiBaseUrl(): string {
  return API_URL
}

export function getCustomerToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setCustomerToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export async function apiRequest<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  if (options.auth) {
    const token = getCustomerToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  const text = await response.text()
  let data: unknown = null
  if (text) {
    try {
      data = JSON.parse(text) as unknown
    } catch {
      data = { error: text }
    }
  }

  if (!response.ok) {
    if (response.status === 401 && options.auth) {
      setCustomerToken(null)
    }
    const message =
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof (data as { error: unknown }).error === 'string'
        ? (data as { error: string }).error
        : `Request failed (${response.status})`
    throw new ApiError(response.status, message)
  }

  return data as T
}
