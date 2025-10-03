// router/guards/adminAuth.js
import { supabase } from '@/plugins/supabase'

/**
 * Check if the current user is a super admin
 * @returns {Promise<boolean>}
 */
export async function isSuperAdmin() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session || !session.user) {
      return false
    }

    // Check if it's the admin email (you can enhance this check)
    // In production, you should check against a database table or user metadata
    const adminEmails = ['admin@safespot.com']
    
    if (adminEmails.includes(session.user.email)) {
      return true
    }

    // Alternative: Check user metadata for is_super_admin flag
    // This assumes you set is_super_admin in user_metadata during registration
    if (session.user.user_metadata?.is_super_admin === true) {
      return true
    }

    // If you have a profiles or admin_users table, query it here
    // const { data, error } = await supabase
    //   .from('profiles')
    //   .select('is_super_admin')
    //   .eq('id', session.user.id)
    //   .single()
    // 
    // return data?.is_super_admin === true

    return false
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Vue Router navigation guard for admin routes
 * @param {Object} to - Target Route Object
 * @param {Object} from - Current Route Object
 * @param {Function} next - Function to resolve the navigation
 */
export async function adminAuthGuard(to, from, next) {
  try {
    console.log('Admin Auth Guard: Checking authentication...')
    
    // Check if user has active session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('Session error:', sessionError)
      next('/')
      return
    }
    
    if (!session) {
      console.log('No active session found')
      next('/')
      return
    }

    // Get current user details
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError) {
      console.error('User verification error:', userError)
      await supabase.auth.signOut()
      next('/')
      return
    }

    if (!user) {
      console.log('No user found')
      await supabase.auth.signOut()
      next('/')
      return
    }

    console.log('Current user:', user.email)

    // Check if user is super admin from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_super_admin')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile lookup error:', profileError)
      await supabase.auth.signOut()
      next('/')
      return
    }

    if (!profile) {
      console.log('No profile found for user')
      await supabase.auth.signOut()
      next('/')
      return
    }

    console.log('User profile:', profile)

    // Check if user is super admin
    if (profile.is_super_admin === true) {
      console.log('✅ Super admin access granted for:', user.email)
      next()
    } else {
      console.log('❌ User is not a super admin:', user.email)
      
      // Sign out non-admin user
      await supabase.auth.signOut()
      
      // Show access denied message
      alert('Access Denied: You do not have super admin privileges.')
      
      next('/')
    }
  } catch (error) {
    console.error('Admin auth guard error:', error)
    await supabase.auth.signOut()
    next('/')
  }
}

/**
 * Check and refresh session if needed
 * @returns {Promise<Object|null>}
 */
export async function refreshAdminSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw error
    }

    if (session) {
      // Session exists, check if it needs refresh
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession()
      
      if (refreshError) {
        throw refreshError
      }
      
      return refreshedSession
    }
    
    return null
  } catch (error) {
    console.error('Error refreshing session:', error)
    return null
  }
}

/**
 * Sign out the current admin user
 * @returns {Promise<void>}
 */
export async function signOutAdmin() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }
    
    // Clear any stored session data
    sessionStorage.removeItem('adminSession')
    localStorage.removeItem('adminSession')
    
  } catch (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

/**
 * Get current admin user info
 * @returns {Promise<Object|null>}
 */
export async function getCurrentAdmin() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session || !session.user) {
      return null
    }

    const isAdmin = await isSuperAdmin()
    
    if (!isAdmin) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      fullName: session.user.user_metadata?.full_name || 'Admin',
      firstName: session.user.user_metadata?.first_name || '',
      lastName: session.user.user_metadata?.last_name || '',
      mobile: session.user.user_metadata?.mobile || '',
      isSuperAdmin: true,
      lastSignIn: session.user.last_sign_in_at
    }
  } catch (error) {
    console.error('Error getting admin info:', error)
    return null
  }
}