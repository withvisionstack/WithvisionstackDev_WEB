import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/SupabaseCli'
import HomeVue from '../views/HomeVue.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeVue },
    { path: '/admin/login', component: LoginView },
    {
      path: '/admin',
      component: DashboardView,
      meta: { requiresAuth: true }
    }
  ],
  scrollBehavior: (to) => {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { data } = await supabase.auth.getSession()
    if (!data.session) return '/admin/login'
  }
})

export default router