<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'

const route = useRoute()
const title = computed(() => {
  const section = String(route.params.section || '')
  return section.charAt(0).toUpperCase() + section.slice(1)
})
</script>

<template>
  <AppLayout :title="title" :subtitle="`Menu ${title.toLowerCase()} sekolah.`">
    <section class="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 class="text-lg font-semibold">Halaman {{ title }}</h2>
      <p class="mt-2 text-slate-500">Fitur ini belum tersedia.</p>
    </section>
  </AppLayout>
</template>
