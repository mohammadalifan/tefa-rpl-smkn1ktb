<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Plus, Pencil, Trash2, UserRoundPlus } from '@lucide/vue'
import AppLayout from '@/components/AppLayout.vue'
import { api, ApiError } from '@/lib/api'
import { useRouter } from 'vue-router'

interface Guru {
  id: number
  name: string
  nip: string
  email: string
  is_active: boolean | number
}

const router = useRouter()
const rows = ref<Guru[]>([])
const loading = ref(true)
const saving = ref(false)
const pageError = ref('')
const notice = ref('')
const formError = ref('')
const dialog = ref<HTMLDialogElement | null>(null)
const editing = ref<Guru | null>(null)
const form = reactive({ name: '', nip: '', email: '', password: '' })

async function load() {
  loading.value = true
  pageError.value = ''
  try {
    const result = await api<{ data: Guru[] }>('/api/guru')
    rows.value = result.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return router.push('/login')
    pageError.value = error instanceof Error ? error.message : 'Data guru gagal dimuat.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', nip: '', email: '', password: '' })
  formError.value = ''
  dialog.value?.showModal()
}

function openEdit(guru: Guru) {
  editing.value = guru
  Object.assign(form, { name: guru.name, nip: guru.nip, email: guru.email, password: '' })
  formError.value = ''
  dialog.value?.showModal()
}

function closeDialog() {
  dialog.value?.close()
  editing.value = null
}

async function save() {
  saving.value = true
  formError.value = ''
  try {
    const isEditing = Boolean(editing.value)
    await api(isEditing ? `/api/guru/${editing.value!.id}` : '/api/guru', {
      method: isEditing ? 'PATCH' : 'POST',
      body: JSON.stringify(form),
    })
    closeDialog()
    notice.value = isEditing ? 'Data guru berhasil diperbarui.' : 'Data guru berhasil ditambahkan.'
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return router.push('/login')
    formError.value = error instanceof Error ? error.message : 'Data guru gagal disimpan.'
  } finally {
    saving.value = false
  }
}

async function remove(guru: Guru) {
  if (!window.confirm(`Hapus data guru ${guru.name}? Akun login guru ini juga akan dihapus.`)) return
  try {
    await api(`/api/guru/${guru.id}`, { method: 'DELETE' })
    notice.value = 'Data guru berhasil dihapus.'
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return router.push('/login')
    pageError.value = error instanceof Error ? error.message : 'Data guru gagal dihapus.'
  }
}

onMounted(load)
</script>

<template>
  <AppLayout title="Data Guru" subtitle="Daftar akun dan identitas guru.">
    <div class="mb-5 flex justify-end">
      <button class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700" @click="openCreate">
        <Plus class="h-4 w-4" />Tambah Guru
      </button>
    </div>
    <p v-if="notice" class="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{{ notice }}</p>
    <p v-if="pageError" class="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ pageError }}</p>
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr><th class="px-5 py-3">No.</th><th class="px-5 py-3">Nama</th><th class="px-5 py-3">NIP</th><th class="px-5 py-3">Email</th><th class="px-5 py-3">Status</th><th class="px-5 py-3">Aksi</th></tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(guru, index) in rows" :key="guru.id">
              <td class="px-5 py-4">{{ index + 1 }}</td><td class="px-5 py-4">{{ guru.name }}</td><td class="px-5 py-4">{{ guru.nip }}</td><td class="px-5 py-4">{{ guru.email }}</td>
              <td class="px-5 py-4"><span :class="guru.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2.5 py-1 text-xs font-medium">{{ guru.is_active ? 'Aktif' : 'Nonaktif' }}</span></td>
              <td class="whitespace-nowrap px-5 py-4">
                <button class="mr-3 inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800" @click="openEdit(guru)"><Pencil class="h-4 w-4" />Edit</button>
                <button class="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-800" @click="remove(guru)"><Trash2 class="h-4 w-4" />Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="loading" class="px-5 py-8 text-center text-sm text-slate-500">Memuat data guru...</p>
      <p v-else-if="rows.length === 0 && !pageError" class="px-5 py-8 text-center text-sm text-slate-500">Belum ada data guru.</p>
    </section>

    <dialog ref="dialog" class="w-full max-w-2xl rounded-xl p-0 shadow-xl backdrop:bg-slate-900/50">
      <section class="p-6">
        <h2 class="text-lg font-semibold">{{ editing ? 'Edit Data Guru' : 'Tambah Guru' }}</h2>
        <p class="mt-1 text-sm text-slate-500">{{ editing ? 'Perbarui identitas atau kredensial akun guru.' : 'Buat akun login dan profil guru baru.' }}</p>
        <form class="mt-5 grid gap-4 sm:grid-cols-2" @submit.prevent="save">
          <div><label for="guru-name" class="mb-1.5 block text-sm font-medium">Nama lengkap</label><input id="guru-name" v-model="form.name" required maxlength="100" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
          <div><label for="guru-nip" class="mb-1.5 block text-sm font-medium">NIP</label><input id="guru-nip" v-model="form.nip" required maxlength="30" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
          <div><label for="guru-email" class="mb-1.5 block text-sm font-medium">Email</label><input id="guru-email" v-model="form.email" type="email" required maxlength="150" autocomplete="email" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
          <div><label for="guru-password" class="mb-1.5 block text-sm font-medium">{{ editing ? 'Password baru (opsional)' : 'Password awal' }}</label><input id="guru-password" v-model="form.password" type="password" :required="!editing" :minlength="form.password ? 8 : undefined" autocomplete="new-password" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /><p v-if="editing" class="mt-1 text-xs text-slate-500">Kosongkan jika password tidak diubah.</p></div>
          <div class="sm:col-span-2">
            <p v-if="formError" class="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{{ formError }}</p>
            <div class="flex justify-end gap-2"><button type="button" class="rounded-lg border border-slate-300 px-4 py-2.5 font-medium hover:bg-slate-50" @click="closeDialog">Batal</button><button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"><UserRoundPlus class="h-4 w-4" />{{ saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan Guru' }}</button></div>
          </div>
        </form>
      </section>
    </dialog>
  </AppLayout>
</template>

