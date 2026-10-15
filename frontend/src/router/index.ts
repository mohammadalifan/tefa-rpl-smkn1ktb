import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from '@/lib/auth'
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import GuruView from '@/views/GuruView.vue'
import SiswaView from '@/views/SiswaView.vue'
import PlaceholderView from '@/views/PlaceholderView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    { path: '/', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/guru', name: 'guru', component: GuruView, meta: { requiresAuth: true } },
    { path: '/siswa', name: 'siswa', component: SiswaView, meta: { requiresAuth: true } },
    {
      path: '/:section(jurusan|kelas|absensi|nilai)',
      name: 'placeholder',
      component: PlaceholderView,
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  const user = await getCurrentUser()
  if (to.meta.requiresAuth && !user) return { name: 'login' }
  if (to.meta.guestOnly && user) return { name: 'dashboard' }
})

export default router
