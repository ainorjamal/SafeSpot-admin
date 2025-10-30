import { ref, computed } from 'vue'
import { supabase } from '@/plugins/supabase'

export function useUserManagement() {
  const users = ref([])
  const loading = ref(false)
  const deleting = ref(false)
  const search = ref('')
  const filterStatus = ref('all')
  const filterRole = ref('all')
  const selectedUser = ref(null)

  const stats = computed(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return {
      total: users.value.length,
      active: users.value.filter(u => u.status === 'active').length,
      newToday: users.value.filter(u => new Date(u.created_at) >= today).length,
      thisMonth: users.value.filter(u => new Date(u.created_at) >= thisMonth).length
    }
  })

  const activePercentage = computed(() => {
    if (stats.value.total === 0) return 0
    return Math.round((stats.value.active / stats.value.total) * 100)
  })

  const monthPercentage = computed(() => {
    if (stats.value.total === 0) return 0
    return Math.round((stats.value.thisMonth / stats.value.total) * 100)
  })

  const filteredUsers = computed(() => {
    let filtered = users.value

    if (filterStatus.value !== 'all') {
      filtered = filtered.filter(u => u.status === filterStatus.value)
    }

    if (filterRole.value !== 'all') {
      filtered = filtered.filter(u => (u.role || 'user') === filterRole.value)
    }

    return filtered
  })

  const getStatusFromDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const daysDiff = (now - date) / (1000 * 60 * 60 * 24)
    return daysDiff < 30 ? 'active' : 'inactive'
  }

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or('is_super_admin.is.null,is_super_admin.eq.false')
        .order('created_at', { ascending: false })

      if (error) throw error

      users.value = data.map(user => ({
        ...user,
        status: getStatusFromDate(user.created_at),
        role: user.role || 'user'
      }))

      console.log('Fetched users:', users.value.length)
      return { success: true }
    } catch (error) {
      console.error('Error fetching users:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId) => {
    deleting.value = true
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      users.value = users.value.filter(u => u.id !== userId)
      return { success: true }
    } catch (error) {
      console.error('Error deleting user:', error)
      return { success: false, error: error.message }
    } finally {
      deleting.value = false
    }
  }

  const clearFilters = () => {
    search.value = ''
    filterStatus.value = 'all'
    filterRole.value = 'all'
  }

  return {
    users,
    loading,
    deleting,
    search,
    filterStatus,
    filterRole,
    selectedUser,
    stats,
    activePercentage,
    monthPercentage,
    filteredUsers,
    fetchUsers,
    deleteUser,
    clearFilters
  }
}
