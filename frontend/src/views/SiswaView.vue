<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { Pencil, Plus, Trash2, UserRoundPlus } from '@lucide/vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/AppLayout.vue'
import { api, ApiError } from '@/lib/api'

interface Siswa {
  id: number
  name: string
  nisn: string
  email: string
  is_active: boolean | number
}

const router = useRouter()
const rows = ref<Siswa[]>([])
const loading = ref(true)
const saving = ref(false)
const pageError = ref('')
const notice = ref('')
const formError = ref('')
const dialog = ref<HTMLDialogElement | null>(null)
const editing = ref<Siswa | null>(null)
const form = reactive({ name: '', nisn: '', email: '', password: '' })

async function load() {
  loading.value = true
  pageError.value = ''
  try {
    const result = await api<{ data: Siswa[] }>('/api/siswa')
    rows.value = result.data
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return router.push('/login')
    pageError.value = error instanceof Error ? error.message : 'Data siswa gagal dimuat.'
  } finally {
    loading.value = false
  }
}

function openEdit(siswa: Siswa) {
  editing.value = siswa
  Object.assign(form, { name: siswa.name, nisn: siswa.nisn, email: siswa.email, password: '' })
  formError.value = ''
  dialog.value?.showModal()
}

function openCreate() {
  editing.value = null
  Object.assign(form, { name: '', nisn: '', email: '', password: '' })
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
    await api(isEditing ? `/api/siswa/${editing.value!.id}` : '/api/siswa', {
      method: isEditing ? 'PATCH' : 'POST',
      body: JSON.stringify(form),
    })
    closeDialog()
    notice.value = isEditing ? 'Data siswa berhasil diperbarui.' : 'Data siswa berhasil ditambahkan.'
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return router.push('/login')
    formError.value = error instanceof Error ? error.message : 'Data siswa gagal diperbarui.'
  } finally {
    saving.value = false
  }
}

async function remove(siswa: Siswa) {
  if (!window.confirm(`Hapus data siswa ${siswa.name}? Akun login siswa ini juga akan dihapus.`)) return
  try {
    await api(`/api/siswa/${siswa.id}`, { method: 'DELETE' })
    notice.value = 'Data siswa berhasil dihapus.'
    await load()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return router.push('/login')
    pageError.value = error instanceof Error ? error.message : 'Data siswa gagal dihapus.'
  }
}

onMounted(load)
</script>

<template>
  <AppLayout title="Data Siswa" subtitle="Daftar akun dan identitas siswa.">
    <div class="mb-5 flex justify-end">
      <button class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700" @click="openCreate">
        <Plus class="h-4 w-4" />Tambah Siswa
      </button>
    </div>
    <p v-if="notice" class="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">{{ notice }}</p>
    <p v-if="pageError" class="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{{ pageError }}</p>
    <section class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th class="px-5 py-3">No.</th><th class="px-5 py-3">Nama</th><th class="px-5 py-3">NISN</th><th class="px-5 py-3">Email</th><th class="px-5 py-3">Status</th><th class="px-5 py-3">Aksi</th></tr></thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(siswa, index) in rows" :key="siswa.id">
              <td class="px-5 py-4">{{ index + 1 }}</td><td class="px-5 py-4">{{ siswa.name }}</td><td class="px-5 py-4">{{ siswa.nisn }}</td><td class="px-5 py-4">{{ siswa.email }}</td>
              <td class="px-5 py-4"><span :class="siswa.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'" class="rounded-full px-2.5 py-1 text-xs font-medium">{{ siswa.is_active ? 'Aktif' : 'Nonaktif' }}</span></td>
              <td class="whitespace-nowrap px-5 py-4"><button class="mr-3 inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-800" @click="openEdit(siswa)"><Pencil class="h-4 w-4" />Edit</button><button class="inline-flex items-center gap-1 font-medium text-red-600 hover:text-red-800" @click="remove(siswa)"><Trash2 class="h-4 w-4" />Hapus</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="loading" class="px-5 py-8 text-center text-sm text-slate-500">Memuat data siswa...</p>
      <p v-else-if="rows.length === 0 && !pageError" class="px-5 py-8 text-center text-sm text-slate-500">Belum ada data siswa.</p>
    </section>

    <dialog ref="dialog" class="w-full max-w-lg rounded-xl p-0 shadow-xl backdrop:bg-slate-900/50">
      <section class="p-6">
        <h2 class="text-lg font-semibold">{{ editing ? 'Edit Data Siswa' : 'Tambah Siswa' }}</h2>
        <p class="mt-1 text-sm text-slate-500">{{ editing ? 'Perbarui identitas atau kredensial akun siswa.' : 'Buat akun login dan profil siswa baru.' }}</p>
        <form class="mt-5 space-y-4" @submit.prevent="save">
          <div><label for="siswa-name" class="mb-1.5 block text-sm font-medium">Nama lengkap</label><input id="siswa-name" v-model="form.name" required maxlength="100" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
          <div><label for="siswa-nisn" class="mb-1.5 block text-sm font-medium">NISN</label><input id="siswa-nisn" v-model="form.nisn" required maxlength="20" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
          <div><label for="siswa-email" class="mb-1.5 block text-sm font-medium">Email</label><input id="siswa-email" v-model="form.email" type="email" required maxlength="150" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /></div>
          <div><label for="siswa-password" class="mb-1.5 block text-sm font-medium">{{ editing ? 'Password baru (opsional)' : 'Password awal' }}</label><input id="siswa-password" v-model="form.password" type="password" :required="!editing" :minlength="form.password ? 8 : undefined" autocomplete="new-password" class="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" /><p v-if="editing" class="mt-1 text-xs text-slate-500">Kosongkan jika password tidak diubah.</p></div>
          <p v-if="formError" class="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{{ formError }}</p>
          <div class="flex justify-end gap-2"><button type="button" class="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-50" @click="closeDialog">Batal</button><button type="submit" :disabled="saving" class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"><UserRoundPlus class="h-4 w-4" />{{ saving ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Simpan Siswa' }}</button></div>
        </form>
      </section>
    </dialog>
  </AppLayout>
</template>

