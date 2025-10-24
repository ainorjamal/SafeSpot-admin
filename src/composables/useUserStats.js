// composables/useUserStats.js
import { ref, computed } from 'vue'
import { supabase } from '@/plugins/supabase'

export function useUserStats() {
  const totalUsers = ref(0)
  const activeUsers = ref(0)
  const inactiveUsers = ref(0)
  const newUsersToday = ref(0)
  const incidentCount = ref(0)
  const reportCount = ref(0)
  const recentActivities = ref([])

  const statistics = computed(() => [
    {
      label: 'Total Users',
      value: totalUsers.value,
      icon: 'mdi-account-group',
      color: '#FF6B35',
      type: 'primary',
      trend: 'up',
      trendIcon: 'mdi-trending-up',
      trendText: '+12.5%',
      progress: 75
    },
    {
      label: 'Active Users',
      value: activeUsers.value,
      icon: 'mdi-account-check',
      color: '#4CAF50',
      type: 'success',
      trend: 'up',
      trendIcon: 'mdi-trending-up',
      trendText: '+8.2%',
      progress: 85
    },
    {
      label: 'New Today',
      value: newUsersToday.value,
      icon: 'mdi-account-plus',
      color: '#FF9800',
      type: 'warning',
      trend: 'up',
      trendIcon: 'mdi-trending-up',
      trendText: `+${newUsersToday.value}`,
      progress: 45
    },
    {
      label: 'Inactive',
      value: inactiveUsers.value,
      icon: 'mdi-account-off',
      color: '#757575',
      type: 'neutral',
      trend: 'neutral',
      trendIcon: 'mdi-minus',
      trendText: '0%',
      progress: 30
    }
  ])

  const quickActions = computed(() => [
    { 
      label: 'Users', 
      icon: 'mdi-account-multiple', 
      color: '#FF6B35', 
      count: totalUsers.value, 
      action: () => {} 
    },
    { 
      label: 'Incidents', 
      icon: 'mdi-alert-octagon', 
      color: '#f44336', 
      count: incidentCount.value, 
      action: () => {} 
    },
    { 
      label: 'Reports', 
      icon: 'mdi-file-chart', 
      color: '#2196F3', 
      count: reportCount.value, 
      action: () => {} 
    },
    { 
      label: 'Analytics', 
      icon: 'mdi-chart-line', 
      color: '#4CAF50', 
      count: 'View', 
      action: () => {} 
    },
    { 
      label: 'Settings', 
      icon: 'mdi-cog', 
      color: '#FF9800', 
      count: 'Config', 
      action: () => {} 
    },
    { 
      label: 'Backup', 
      icon: 'mdi-backup-restore', 
      color: '#9C27B0', 
      count: 'Run', 
      action: () => {} 
    }
  ])

  const fetchUserStatistics = async () => {
    try {
      const { count: total } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
      
      const { count: active } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('is_active', true)
      
      const { count: newToday } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('is_active', true)
        .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
      
      const { count: inactive } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' })
        .eq('is_active', false)

      totalUsers.value = total || 0
      activeUsers.value = active || 0
      newUsersToday.value = newToday || 0
      inactiveUsers.value = inactive || 0
    } catch (error) {
      console.error('Error fetching user statistics:', error)
    }
  }

  const fetchUserStats = async () => {
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')

      if (error) throw error

      if (users && users.length > 0) {
        totalUsers.value = users.length
        
        activeUsers.value = users.filter(user => {
          if (!user.last_sign_in) return false
          const lastLogin = new Date(user.last_sign_in)
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          return lastLogin > thirtyDaysAgo
        }).length

        inactiveUsers.value = totalUsers.value - activeUsers.value

        newUsersToday.value = users.filter(user => {
          if (!user.created_at) return false
          const created = new Date(user.created_at)
          const today = new Date()
          return created.toDateString() === today.toDateString()
        }).length
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  const fetchRecentActivities = async () => {
    try {
      const { data: recentUsers, error: userError } = await supabase
        .from('profiles')
        .select('created_at, email')
        .order('created_at', { ascending: false })
        .limit(10)

      if (userError) throw userError

      const activities = []

      if (recentUsers && recentUsers.length > 0) {
        recentUsers.slice(0, 3).forEach(user => {
          const timeDiff = getTimeDifference(user.created_at)
          activities.push({
            text: `New user registered: ${user.email}`,
            time: timeDiff,
            icon: 'mdi-account-plus',
            color: '#4CAF50',
            type: 'success'
          })
        })
      }

      activities.push(
        {
          text: 'System backup completed',
          time: '15 minutes ago',
          icon: 'mdi-check-circle',
          color: '#2196F3',
          type: 'info'
        },
        {
          text: 'Database optimized',
          time: '2 hours ago',
          icon: 'mdi-database-refresh',
          color: '#9C27B0',
          type: 'info'
        }
      )

      recentActivities.value = activities.slice(0, 6)
    } catch (error) {
      console.error('Error fetching activities:', error)
    }
  }

  const fetchIncidentReports = async () => {
    try {
      const { count: incidents, error: incidentError } = await supabase
        .from('incidents')
        .select('id', { count: 'exact' })

      if (!incidentError) {
        incidentCount.value = incidents || 0
      } else {
        incidentCount.value = 0
      }

      const { count: reports, error: reportError } = await supabase
        .from('reports')
        .select('id', { count: 'exact' })

      if (!reportError) {
        reportCount.value = reports || 0
      } else {
        reportCount.value = 0
      }
    } catch (error) {
      console.error('Error fetching incident reports:', error)
      incidentCount.value = 0
      reportCount.value = 0
    }
  }

  const getTimeDifference = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diffInMs = now - past
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  const fetchAllStats = async () => {
    await Promise.all([
      fetchUserStatistics(),
      fetchUserStats(),
      fetchRecentActivities(),
      fetchIncidentReports()
    ])
  }

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    newUsersToday,
    incidentCount,
    reportCount,
    recentActivities,
    statistics,
    quickActions,
    fetchUserStatistics,
    fetchUserStats,
    fetchRecentActivities,
    fetchIncidentReports,
    fetchAllStats
  }
}