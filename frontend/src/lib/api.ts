export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  const response = await fetch(url, { ...options, headers, credentials: 'same-origin' })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new ApiError(result.message || 'Permintaan gagal diproses.', response.status)
  }
  return result as T
}
