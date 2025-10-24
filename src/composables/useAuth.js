// composables/useAuth.js
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/plugins/supabase'

export function useAuth() {
  const router = useRouter()
  
  const userEmail = ref('')
  const userProfile = ref(null)
  const loading = ref(false)
  const logoutDialog = ref(false)
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref('info')

  const showMessage = (text, color = 'info') => {
    snackbarText.value = text
    snackbarColor.value = color
    snackbar.value = true
  }

  const getUserInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        userEmail.value = user.email
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Profile fetch error:', error)
          showMessage('Error loading profile', 'error')
          return
        }

        userProfile.value = profile
        
        if (!profile?.is_super_admin) {
          console.log('Non-super-admin user detected, signing out...')
          await supabase.auth.signOut()
          router.push('/')
        }
      }
    } catch (error) {
      console.error('Error getting user info:', error)
      showMessage('Error loading user info', 'error')
    }
  }

  const setupAuthStateListener = () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/')
      } else if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_super_admin')
          .eq('id', session.user.id)
          .single()

        if (!profile?.is_super_admin) {
          await supabase.auth.signOut()
          router.push('/')
        }
      }
    })
  }

  const logout = () => {
    logoutDialog.value = true
  }

  const confirmLogout = async () => {
    loading.value = true
    logoutDialog.value = false
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        showMessage('Logout failed: ' + error.message, 'error')
      } else {
        showMessage('Successfully signed out', 'success')
        
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    } catch (error) {
      console.error('Logout error:', error)
      showMessage('Logout failed: ' + error.message, 'error')
    } finally {
      loading.value = false
    }
  }

  const initialize = async () => {
    await getUserInfo()
    setupAuthStateListener()
  }

  return {
    userEmail,
    userProfile,
    loading,
    logoutDialog,
    snackbar,
    snackbarText,
    snackbarColor,
    logout,
    confirmLogout,
    showMessage,
    initialize
  }
}