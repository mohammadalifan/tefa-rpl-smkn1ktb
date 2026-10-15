<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, GraduationCap } from '@lucide/vue'
import { api } from '@/lib/api'
import { setCurrentUser, type User } from '@/lib/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  try {
    const result = await api<{ user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.value, password: password.value }),
    })
    setCurrentUser(result.user)
    await router.push('/')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Login gagal.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-slate-800">
    <section class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg shadow-slate-200/70">
      <div class="mb-8 text-center">
        <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <GraduationCap class="h-6 w-6" />
        </div>
        <h1 class="text-2xl font-bold">Masuk ke TEFA RPL</h1>
        <p class="mt-2 text-sm text-slate-500">Gunakan email dan password akun Anda.</p>
      </div>
      <form class="space-y-5" @submit.prevent="submit">
        <div>
          <label for="email" class="mb-1.5 block text-sm font-medium">Email</label>
          <input id="email" v-model="email" type="email" required autocomplete="username" placeholder="nama@sekolah.id" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <div>
          <label for="password" class="mb-1.5 block text-sm font-medium">Password</label>
          <input id="password" v-model="password" type="password" required autocomplete="current-password" placeholder="Masukkan password" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <p v-if="error" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{{ error }}</p>
        <button type="submit" :disabled="loading" class="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60">
          <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span><ArrowRight class="h-4 w-4" />
        </button>
      </form>
    </section>
  </main>
</template>
