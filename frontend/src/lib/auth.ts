import { ref } from 'vue'
import { api } from './api'

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'guru' | 'siswa'
}

const user = ref<User | null>(null)
let checked = false
let checking: Promise<User | null> | null = null

export function useAuth() {
  return { user }
}

export async function getCurrentUser() {
  if (checked) return user.value
  if (checking) return checking

  checking = api<{ user: User | null }>('/api/auth/me')
    .then((result) => {
      user.value = result.user
      checked = true
      return user.value
    })
    .catch(() => {
      user.value = null
      checked = true
      return null
    })
    .finally(() => {
      checking = null
    })

  return checking
}

export function setCurrentUser(nextUser: User | null) {
  user.value = nextUser
  checked = true
}
