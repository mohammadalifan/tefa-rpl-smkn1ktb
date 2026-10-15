<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  PanelsTopLeft,
  School,
  UsersRound,
} from '@lucide/vue'
import { api } from '@/lib/api'
import { setCurrentUser, useAuth } from '@/lib/auth'

defineProps<{ title: string; subtitle: string }>()

const router = useRouter()
const { user } = useAuth()

async function logout() {
  try {
    await api('/api/auth/logout', { method: 'POST' })
  } finally {
    setCurrentUser(null)
    await router.push('/login')
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800 md:flex">
    <aside class="bg-slate-900 px-5 py-5 text-white md:min-h-screen md:w-64 md:shrink-0 md:py-6">
      <RouterLink to="/" class="mb-5 block text-xl font-bold md:mb-8">TEFA RPL</RouterLink>
      <nav aria-label="Menu utama" class="space-y-1">
        <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Utama</p>
        <RouterLink to="/" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white" active-class="bg-slate-800 font-medium text-white"><LayoutDashboard class="h-5 w-5" />Dashboard</RouterLink>
      </nav>
      <nav aria-label="Menu akademik" class="mt-5 space-y-1 md:mt-8">
        <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">Akademik</p>
        <RouterLink to="/guru" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white" active-class="bg-slate-800 font-medium text-white"><UsersRound class="h-5 w-5" />Data Guru</RouterLink>
        <RouterLink to="/siswa" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white" active-class="bg-slate-800 font-medium text-white"><GraduationCap class="h-5 w-5" />Data Siswa</RouterLink>
        <RouterLink to="/jurusan" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white" active-class="bg-slate-800 font-medium text-white"><PanelsTopLeft class="h-5 w-5" />Jurusan</RouterLink>
        <RouterLink to="/kelas" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white" active-class="bg-slate-800 font-medium text-white"><School class="h-5 w-5" />Kelas</RouterLink>
        <RouterLink to="/absensi" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white" active-class="bg-slate-800 font-medium text-white"><CalendarCheck class="h-5 w-5" />Absensi</RouterLink>
        <RouterLink to="/nilai" class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-300 transition hover:bg-slate-800 hover:text-white" active-class="bg-slate-800 font-medium text-white"><ClipboardList class="h-5 w-5" />Nilai</RouterLink>
      </nav>
    </aside>

    <main class="min-w-0 flex-1 p-5 md:p-8">
      <header class="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold">{{ title }}</h1>
          <p class="mt-2 text-slate-600">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden text-sm text-slate-600 sm:inline">{{ user?.name }}</span>
          <button class="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50" @click="logout">
            <LogOut class="h-4 w-4" /><span class="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>
      <slot />
    </main>
  </div>
</template>
