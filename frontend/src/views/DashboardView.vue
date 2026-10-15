<script setup lang="ts">
import { LayoutDashboard, UsersRound, GraduationCap } from '@lucide/vue'
import AppLayout from '@/components/AppLayout.vue'
</script>

<template>
  <AppLayout title="Dashboard" subtitle="Ringkasan sistem informasi sekolah.">
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <RouterLink to="/guru" class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <span class="rounded-xl bg-indigo-50 p-3 text-indigo-700"><UsersRound class="h-6 w-6" /></span>
        <span><span class="block text-sm text-slate-500">Kelola data</span><strong class="text-lg">Data Guru</strong></span>
      </RouterLink>
      <RouterLink to="/siswa" class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
        <span class="rounded-xl bg-emerald-50 p-3 text-emerald-700"><GraduationCap class="h-6 w-6" /></span>
        <span><span class="block text-sm text-slate-500">Kelola data</span><strong class="text-lg">Data Siswa</strong></span>
      </RouterLink>
      <div class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <span class="rounded-xl bg-amber-50 p-3 text-amber-700"><LayoutDashboard class="h-6 w-6" /></span>
        <span><span class="block text-sm text-slate-500">Selamat datang</span><strong class="text-lg">TEFA RPL</strong></span>
      </div>
    </section>
  </AppLayout>
</template>
