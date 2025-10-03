// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import AdminLogin from '@/components/AdminLogin.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import { supabase } from '@/plugins/supabase'

// Define routes
const routes = [
  {
    path: '/',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    beforeEnter: async (to, from, next) => {
      try {
        console.log('Route guard: Checking authentication...')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          next('/')
          return
        }
        
        if (!session) {
          console.log('No active session')
          next('/')
          return
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.error('User verification error:', userError)
          await supabase.auth.signOut()
          next('/')
          return
        }

        console.log('Current user:', user)

        // Check if user is the admin (update email to match your admin user)
        if (user && user.email === 'admin@safespot.com') {
          console.log('Admin access granted')
          next()
        } else {
          console.log('Unauthorized user:', user?.email)
          await supabase.auth.signOut()
          next('/')
        }
      } catch (error) {
        console.error('Route guard error:', error)
        next('/')
      }
    }
  },
  {
    path: '/admin/dashboard',
    redirect: '/admin'
  },
  // Catch all route - redirect to login
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router