<template>
  <div class="dashboard-card">
    <div class="card-header">
      <div class="card-title-group">
        <v-icon color="#FF6B35" size="24" class="mr-3">mdi-history</v-icon>
        <div>
          <h3 class="card-title">Recent Activity</h3>
          <p class="card-subtitle">Last 24 hours</p>
        </div>
      </div>
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon size="small" variant="text" v-bind="props">
            <v-icon size="18" color="#666">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list density="compact" class="dropdown-menu">
          <v-list-item @click="refreshActivities">
            <template v-slot:prepend>
              <v-icon size="18" color="#FF6B35">mdi-refresh</v-icon>
            </template>
            <v-list-item-title>Refresh</v-list-item-title>
          </v-list-item>
          <v-list-item @click="clearActivities">
            <template v-slot:prepend>
              <v-icon size="18" color="#f44336">mdi-delete</v-icon>
            </template>
            <v-list-item-title>Clear All</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
    <div class="card-body pa-0">
      <div v-if="loading" class="activity-loading">
        <v-progress-circular
          indeterminate
          color="#FF6B35"
          size="48"
        ></v-progress-circular>
        <p class="mt-4">Loading activities...</p>
      </div>
      <div v-else-if="activities.length === 0" class="no-activity">
        <v-icon size="48" color="#666">mdi-history</v-icon>
        <p class="mt-4">No recent activities</p>
      </div>
      <div v-else class="activity-list">
        <transition-group name="activity-slide">
          <div 
            v-for="activity in activities" 
            :key="activity.id" 
            class="activity-item"
          >
            <div class="activity-icon" :class="`activity-${activity.type}`">
              <v-icon size="16" :color="activity.color">{{ activity.icon }}</v-icon>
            </div>
            <div class="activity-content">
              <div class="activity-text">{{ activity.text }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
            <v-btn
              icon
              size="x-small"
              variant="text"
              @click="removeActivity(activity.id)"
              class="activity-remove"
            >
              <v-icon size="14" color="#666">mdi-close</v-icon>
            </v-btn>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/plugins/supabase'

export default {
  name: 'ActivityFeed',
  data() {
    return {
      activities: [],
      loading: true
    }
  },
  mounted() {
    this.fetchActivities()
  },
  methods: {
    async fetchActivities() {
      this.loading = true
      try {
        // Fetch recent user registrations
        const { data: recentUsers, error: userError } = await supabase
          .from('profiles')
          .select('created_at, email')
          .order('created_at', { ascending: false })
          .limit(10)

        if (userError) throw userError

        this.activities = []

        // Add user registration activities
        if (recentUsers && recentUsers.length > 0) {
          recentUsers.slice(0, 3).forEach((user, index) => {
            const timeDiff = this.getTimeDifference(user.created_at)
            this.activities.push({
              id: `user-${index}-${Date.now()}`,
              text: `New user registered: ${user.email}`,
              time: timeDiff,
              icon: 'mdi-account-plus',
              color: '#4CAF50',
              type: 'success'
            })
          })
        }

        // Add system activities
        this.activities.push(
          {
            id: `system-1-${Date.now()}`,
            text: 'System backup completed',
            time: '15 minutes ago',
            icon: 'mdi-check-circle',
            color: '#2196F3',
            type: 'info'
          },
          {
            id: `system-2-${Date.now()}`,
            text: 'Database optimized',
            time: '2 hours ago',
            icon: 'mdi-database-refresh',
            color: '#9C27B0',
            type: 'info'
          },
          {
            id: `system-3-${Date.now()}`,
            text: 'Security scan completed',
            time: '4 hours ago',
            icon: 'mdi-shield-check',
            color: '#FF9800',
            type: 'warning'
          }
        )

        this.activities = this.activities.slice(0, 8)

      } catch (error) {
        console.error('Error fetching activities:', error)
        this.$emit('error', 'Failed to load activities')
      } finally {
        this.loading = false
      }
    },

    getTimeDifference(timestamp) {
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
    },

    refreshActivities() {
      this.fetchActivities()
      this.$emit('refresh')
    },

    clearActivities() {
      this.activities = []
      this.$emit('clear')
    },

    removeActivity(id) {
      this.activities = this.activities.filter(a => a.id !== id)
    }
  }
}
</script>

<style scoped>
.dashboard-card {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
}

.dashboard-card:hover {
  border-color: rgba(255, 107, 53, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-title-group {
  display: flex;
  align-items: center;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}

.card-subtitle {
  font-size: 13px;
  color: #999;
}

.card-body {
  padding: 0;
}

.dropdown-menu {
  background: rgba(20, 20, 20, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
}

.activity-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  color: #999;
}

.activity-list {
  max-height: 500px;
  overflow-y: auto;
}

.activity-list::-webkit-scrollbar {
  width: 6px;
}

.activity-list::-webkit-scrollbar-track {
  background: rgba(20, 20, 20, 0.5);
}

.activity-list::-webkit-scrollbar-thumb {
  background: rgba(255, 107, 53, 0.3);
  border-radius: 3px;
}

.activity-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 107, 53, 0.5);
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.02);
}

.activity-item:hover .activity-remove {
  opacity: 1;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-success {
  background: rgba(76, 175, 80, 0.15);
}

.activity-info {
  background: rgba(33, 150, 243, 0.15);
}

.activity-warning {
  background: rgba(255, 152, 0, 0.15);
}

.activity-error {
  background: rgba(244, 67, 54, 0.15);
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 14px;
  color: #fff;
  margin-bottom: 4px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-time {
  font-size: 12px;
  color: #666;
}

.activity-remove {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.no-activity {
  text-align: center;
  padding: 60px 24px;
  color: #666;
}

.no-activity p {
  margin-top: 12px;
  font-size: 14px;
}

/* Animations */
.activity-slide-enter-active,
.activity-slide-leave-active {
  transition: all 0.3s ease;
}

.activity-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.activity-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.activity-slide-move {
  transition: transform 0.3s ease;
}

@media (max-width: 600px) {
  .card-header {
    padding: 20px;
  }
  
  .activity-item {
    padding: 12px 20px;
  }
  
  .activity-icon {
    width: 36px;
    height: 36px;
  }
  
  .activity-text {
    font-size: 13px;
  }
}
</style>