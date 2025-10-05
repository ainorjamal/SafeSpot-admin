<template>
  <v-app>
    <!-- Animated Background -->
    <div class="dashboard-background">
      <div class="background-gradient"></div>
      <div class="grid-overlay"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>

    <!-- Modern Sidebar Navigation -->
    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      :rail="rail"
      class="modern-sidebar"
      color="transparent"
    >
      <div class="sidebar-header">
        <div class="logo-container" @click="rail = !rail">
          <div class="logo-icon">
            <v-icon color="#FF6B35" size="32">mdi-shield-crown</v-icon>
          </div>
          <transition name="fade">
            <div v-show="!rail" class="logo-text">
              <span class="logo-title">SafeSpot</span>
              <span class="logo-subtitle">Admin Panel</span>
            </div>
          </transition>
        </div>
      </div>

      <v-divider class="sidebar-divider"></v-divider>

      <v-list density="compact" nav class="sidebar-menu">
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :value="item.value"
          :active="activeMenu === item.value"
          @click="activeMenu = item.value"
          class="menu-item"
          rounded="xl"
        >
          <template v-slot:prepend>
            <v-icon :color="activeMenu === item.value ? '#FF6B35' : '#666'">{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="sidebar-footer">
          <v-divider class="sidebar-divider mb-4"></v-divider>
          <v-list-item
            @click="logout"
            class="menu-item logout-item"
            rounded="xl"
          >
            <template v-slot:prepend>
              <v-icon color="#f44336">mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top Navigation Bar -->
    <v-app-bar 
      color="transparent" 
      elevation="0"
      app
      class="top-navbar"
    >
      <v-btn
        icon
        @click="rail = !rail"
        class="menu-toggle"
        variant="text"
      >
        <v-icon color="#FF6B35">mdi-menu</v-icon>
      </v-btn>

      <v-toolbar-title class="page-title">
        <v-icon class="mr-2" color="#FF6B35" size="20">mdi-view-dashboard</v-icon>
        {{ currentPageTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Bar -->
      <div class="search-container">
        <v-text-field
          v-model="searchQuery"
          density="compact"
          variant="solo"
          placeholder="Search..."
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          class="search-field"
        ></v-text-field>
      </div>

      <!-- Notifications -->
      <v-btn icon class="nav-action-btn" variant="text">
        <v-badge color="#FF6B35" content="3" offset-x="-2" offset-y="2">
          <v-icon color="#fff">mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <!-- User Menu -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <div class="user-profile" v-bind="props">
            <div class="user-avatar">
              <v-icon color="#FF6B35" size="20">mdi-account</v-icon>
            </div>
            <div class="user-details">
              <span class="user-name">Super Admin</span>
              <span class="user-email-short">{{ userEmail }}</span>
            </div>
            <v-icon color="#999" size="20">mdi-chevron-down</v-icon>
          </div>
        </template>
        <v-list class="user-menu-dropdown">
          <v-list-item @click="() => {}">
            <template v-slot:prepend>
              <v-icon color="#FF6B35">mdi-account-circle</v-icon>
            </template>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="() => {}">
            <template v-slot:prepend>
              <v-icon color="#FF6B35">mdi-cog</v-icon>
            </template>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <v-list-item @click="logout">
            <template v-slot:prepend>
              <v-icon color="#f44336">mdi-logout</v-icon>
            </template>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="content-container">
        <!-- Breadcrumb Navigation -->
        <div class="breadcrumb-section mb-6">
          <v-breadcrumbs :items="breadcrumbs" class="custom-breadcrumb pa-0">
            <template v-slot:divider>
              <v-icon size="16" color="#666">mdi-chevron-right</v-icon>
            </template>
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item :disabled="item.disabled">
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </div>

        <!-- Welcome Header Section -->
        <transition name="fade-slide">
          <div v-show="showContent" class="welcome-header mb-8">
            <div class="welcome-content">
              <div class="welcome-badge">
                <v-icon size="24" color="#FF6B35">mdi-shield-star</v-icon>
              </div>
              <div class="welcome-text-content">
                <h1 class="welcome-title">Welcome Back, Super Admin 👋</h1>
                <p class="welcome-subtitle">
                  Here's what's happening with your platform today
                </p>
              </div>
            </div>
            <div class="welcome-actions">
              <v-btn
                color="#FF6B35"
                size="large"
                variant="flat"
                prepend-icon="mdi-plus"
                class="action-button"
              >
                Add New User
              </v-btn>
              <v-btn
                color="transparent"
                size="large"
                variant="outlined"
                prepend-icon="mdi-download"
                class="action-button-outlined"
              >
                Export Data
              </v-btn>
            </div>
          </div>
        </transition>

        <!-- Statistics Overview Cards -->
        <v-row class="mb-8">
          <v-col cols="12" sm="6" lg="3" v-for="(stat, index) in statistics" :key="index">
            <transition name="fade-slide" :style="{ transitionDelay: `${index * 50}ms` }">
              <div v-show="showContent" class="stat-card" :class="`stat-${stat.type}`">
                <div class="stat-header">
                  <div class="stat-icon-box" :class="`icon-${stat.type}`">
                    <v-icon :color="stat.color" size="24">{{ stat.icon }}</v-icon>
                  </div>
                  <v-menu offset-y>
                    <template v-slot:activator="{ props }">
                      <v-btn icon size="x-small" variant="text" v-bind="props">
                        <v-icon size="18" color="#666">mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list density="compact">
                      <v-list-item>View Details</v-list-item>
                      <v-list-item>Export</v-list-item>
                    </v-list>
                  </v-menu>
                </div>
                <div class="stat-body">
                  <div class="stat-value">{{ stat.value }}</div>
                  <div class="stat-label">{{ stat.label }}</div>
                </div>
                <div class="stat-footer">
                  <div class="stat-trend" :class="stat.trend">
                    <v-icon size="14">{{ stat.trendIcon }}</v-icon>
                    <span>{{ stat.trendText }}</span>
                  </div>
                  <div class="stat-period">vs last month</div>
                </div>
                <div class="stat-progress">
                  <div class="progress-bar" :style="{ width: stat.progress + '%' }"></div>
                </div>
              </div>
            </transition>
          </v-col>
        </v-row>

        <!-- Main Dashboard Grid -->
        <v-row>
          <!-- System Status Panel -->
          <v-col cols="12" lg="8">
            <transition name="fade-slide">
              <div v-show="showContent" class="dashboard-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <v-icon color="#FF6B35" size="24" class="mr-3">mdi-pulse</v-icon>
                    <div>
                      <h3 class="card-title">System Status</h3>
                      <p class="card-subtitle">Real-time monitoring</p>
                    </div>
                  </div>
                  <v-chip color="success" size="small" variant="flat">
                    <v-icon size="12" class="mr-1">mdi-circle</v-icon>
                    All Systems Operational
                  </v-chip>
                </div>
                <div class="card-body">
                  <v-row>
                    <v-col cols="12" sm="6" v-for="(status, index) in systemStatus" :key="index">
                      <div class="status-item">
                        <div class="status-item-header">
                          <div class="status-icon" :class="`status-${status.statusClass}`">
                            <v-icon :color="status.iconColor" size="20">{{ status.icon }}</v-icon>
                          </div>
                          <div class="status-info">
                            <div class="status-name">{{ status.title }}</div>
                            <div class="status-value">{{ status.status }}</div>
                          </div>
                        </div>
                        <div class="status-metrics">
                          <div class="metric-item">
                            <span class="metric-label">Uptime</span>
                            <span class="metric-value">99.9%</span>
                          </div>
                          <div class="metric-item">
                            <span class="metric-label">Response</span>
                            <span class="metric-value">{{ status.response }}ms</span>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </transition>

            <!-- Quick Actions Panel -->
            <transition name="fade-slide">
              <div v-show="showContent" class="dashboard-card mt-6">
                <div class="card-header">
                  <div class="card-title-group">
                    <v-icon color="#FF6B35" size="24" class="mr-3">mdi-lightning-bolt</v-icon>
                    <div>
                      <h3 class="card-title">Quick Actions</h3>
                      <p class="card-subtitle">Frequently used tools</p>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <v-row>
                    <v-col cols="12" sm="6" md="4" v-for="(action, index) in quickActions" :key="index">
                      <div class="action-tile" @click="action.action">
                        <div class="action-tile-icon">
                          <v-icon :color="action.color" size="28">{{ action.icon }}</v-icon>
                        </div>
                        <div class="action-tile-content">
                          <div class="action-tile-title">{{ action.label }}</div>
                          <div class="action-tile-count">{{ action.count }}</div>
                        </div>
                        <v-icon class="action-tile-arrow" color="#666" size="20">mdi-arrow-right</v-icon>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </transition>
          </v-col>

          <!-- Right Sidebar - Activity & Notifications -->
          <v-col cols="12" lg="4">
            <!-- Activity Feed -->
            <transition name="fade-slide">
              <div v-show="showContent" class="dashboard-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <v-icon color="#FF6B35" size="24" class="mr-3">mdi-history</v-icon>
                    <div>
                      <h3 class="card-title">Recent Activity</h3>
                      <p class="card-subtitle">Last 24 hours</p>
                    </div>
                  </div>
                </div>
                <div class="card-body pa-0">
                  <div class="activity-list">
                    <div v-for="(activity, index) in recentActivities" :key="index" class="activity-item">
                      <div class="activity-icon" :class="`activity-${activity.type}`">
                        <v-icon size="16" :color="activity.color">{{ activity.icon }}</v-icon>
                      </div>
                      <div class="activity-content">
                        <div class="activity-text">{{ activity.text }}</div>
                        <div class="activity-time">{{ activity.time }}</div>
                      </div>
                    </div>
                    <div v-if="recentActivities.length === 0" class="no-activity">
                      <v-icon size="48" color="#666">mdi-history</v-icon>
                      <p>No recent activities</p>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- System Info Card -->
            <transition name="fade-slide">
              <div v-show="showContent" class="dashboard-card mt-6">
                <div class="card-header">
                  <div class="card-title-group">
                    <v-icon color="#FF6B35" size="24" class="mr-3">mdi-information</v-icon>
                    <div>
                      <h3 class="card-title">System Info</h3>
                      <p class="card-subtitle">Current status</p>
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="info-list">
                    <div class="info-item">
                      <span class="info-label">Version</span>
                      <span class="info-value">v2.4.1</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Last Update</span>
                      <span class="info-value">2 hours ago</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Server Load</span>
                      <span class="info-value">
                        <v-chip size="x-small" color="success" variant="flat">Low</v-chip>
                      </span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Storage Used</span>
                      <span class="info-value">45%</span>
                    </div>
                  </div>
                  <v-progress-linear
                    color="#FF6B35"
                    height="6"
                    value="45"
                    rounded
                    class="mt-4"
                  ></v-progress-linear>
                </div>
              </div>
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Logout Confirmation Dialog -->
    <v-dialog v-model="logoutDialog" max-width="400">
      <v-card class="modern-dialog">
        <v-card-text class="dialog-content">
          <div class="dialog-header">
            <div class="dialog-icon-wrapper">
              <v-icon color="#FF6B35" size="32">mdi-logout-variant</v-icon>
            </div>
            <h3 class="dialog-title">Confirm Logout</h3>
            <p class="dialog-subtitle">Are you sure you want to sign out of the admin panel?</p>
          </div>
          <div class="dialog-actions">
            <v-btn 
              variant="tonal"
              @click="logoutDialog = false"
              class="cancel-btn"
              :width="150"
              color="grey-darken-3"
            >
              Cancel
            </v-btn>
            <v-btn 
              color="#FF6B35"
              variant="flat"
              @click="confirmLogout"
              :loading="loading"
              class="confirm-btn"
              :width="150"
            >
              Sign Out
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top right"
      class="custom-snackbar"
    >
      <div class="snackbar-content">
        <v-icon class="mr-2" size="20">
          {{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ snackbarText }}
      </div>
      <template v-slot:actions>
        <v-btn
          variant="text"
          size="small"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { supabase } from '@/plugins/supabase'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      drawer: true,
      rail: false,
      loading: false,
      userEmail: '',
      userProfile: null,
      logoutDialog: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'info',
      showContent: false,
      searchQuery: '',
      activeMenu: 'dashboard',
      menuItems: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard', value: 'dashboard' },
        { title: 'User Management', icon: 'mdi-account-multiple', value: 'users' },
        { title: 'Safety Map', icon: 'mdi-map-marker', value: 'map' },
        { title: 'Analytics', icon: 'mdi-chart-line', value: 'analytics' },
        { title: 'Reports', icon: 'mdi-file-chart', value: 'reports' },
        { title: 'Settings', icon: 'mdi-cog', value: 'settings' }
      ],
      breadcrumbs: [
        { title: 'Admin', disabled: false },
        { title: 'Dashboard', disabled: true }
      ],
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      newUsersToday: 0,
      incidentCount: 0,
      reportCount: 0,
      recentActivities: [],
      systemStatus: [
        { 
          title: 'System Health', 
          status: 'Operational', 
          icon: 'mdi-server', 
          iconColor: '#4CAF50', 
          statusClass: 'online',
          response: 45
        },
        { 
          title: 'Database', 
          status: 'Connected', 
          icon: 'mdi-database', 
          iconColor: '#2196F3', 
          statusClass: 'online',
          response: 23
        },
        { 
          title: 'Security', 
          status: 'Protected', 
          icon: 'mdi-shield-lock', 
          iconColor: '#FF9800', 
          statusClass: 'online',
          response: 12
        },
        { 
          title: 'API Services', 
          status: 'Active', 
          icon: 'mdi-api', 
          iconColor: '#FF6B35', 
          statusClass: 'online',
          response: 67
        }
      ]
    }
  },
  computed: {
    statistics() {
      return [
        {
          label: 'Total Users',
          value: this.totalUsers,
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
          value: this.activeUsers,
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
          value: this.newUsersToday,
          icon: 'mdi-account-plus',
          color: '#FF9800',
          type: 'warning',
          trend: 'up',
          trendIcon: 'mdi-trending-up',
          trendText: `+${this.newUsersToday}`,
          progress: 45
        },
        {
          label: 'Inactive',
          value: this.inactiveUsers,
          icon: 'mdi-account-off',
          color: '#757575',
          type: 'neutral',
          trend: 'neutral',
          trendIcon: 'mdi-minus',
          trendText: '0%',
          progress: 30
        }
      ]
    },
    currentPageTitle() {
      const active = this.menuItems.find(item => item.value === this.activeMenu)
      return active ? active.title : 'Dashboard'
    },
    quickActions() {
      return [
        { label: 'Users', icon: 'mdi-account-multiple', color: '#FF6B35', count: this.totalUsers, action: () => {} },
        { label: 'Incidents', icon: 'mdi-alert-octagon', color: '#f44336', count: this.incidentCount, action: () => {} },
        { label: 'Reports', icon: 'mdi-file-chart', color: '#2196F3', count: this.reportCount, action: () => {} },
        { label: 'Analytics', icon: 'mdi-chart-line', color: '#4CAF50', count: 'View', action: () => {} },
        { label: 'Settings', icon: 'mdi-cog', color: '#FF9800', count: 'Config', action: () => {} },
        { label: 'Backup', icon: 'mdi-backup-restore', color: '#9C27B0', count: 'Run', action: () => {} }
      ]
    }
  },
  async mounted() {
    await this.getUserInfo()
    this.setupAuthStateListener()
    await this.fetchUserStatistics()
    await this.fetchUserStats()
    await this.fetchRecentActivities()
    await this.fetchIncidentReports()
    
    setTimeout(() => {
      this.showContent = true
    }, 200)
  },
  methods: {
    async getUserInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          this.userEmail = user.email
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Profile fetch error:', error)
            this.showMessage('Error loading profile', 'error')
            return
          }

          this.userProfile = profile
          
          if (!profile?.is_super_admin) {
            console.log('Non-super-admin user detected, signing out...')
            await supabase.auth.signOut()
            this.$router.push('/')
          }
        }
      } catch (error) {
        console.error('Error getting user info:', error)
        this.showMessage('Error loading user info', 'error')
      }
    },

    async fetchUserStatistics() {
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

        this.totalUsers = total || 0
        this.activeUsers = active || 0
        this.newUsersToday = newToday || 0
        this.inactiveUsers = inactive || 0
      } catch (error) {
        console.error('Error fetching user statistics:', error)
        this.showMessage('Error loading user statistics', 'error')
      }
    },

    async fetchUserStats() {
      try {
        const { data: users, error } = await supabase
          .from('profiles')
          .select('*')

        if (error) throw error

        if (users && users.length > 0) {
          this.totalUsers = users.length
          
          this.activeUsers = users.filter(user => {
            if (!user.last_sign_in) return false
            const lastLogin = new Date(user.last_sign_in)
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            return lastLogin > thirtyDaysAgo
          }).length

          this.inactiveUsers = this.totalUsers - this.activeUsers

          this.newUsersToday = users.filter(user => {
            if (!user.created_at) return false
            const created = new Date(user.created_at)
            const today = new Date()
            return created.toDateString() === today.toDateString()
          }).length
        }

      } catch (error) {
        console.error('Error fetching user stats:', error)
        this.showMessage('Error loading user statistics', 'error')
      }
    },

    async fetchRecentActivities() {
      try {
        const { data: recentUsers, error: userError } = await supabase
          .from('profiles')
          .select('created_at, email')
          .order('created_at', { ascending: false })
          .limit(10)

        if (userError) throw userError

        this.recentActivities = []

        if (recentUsers && recentUsers.length > 0) {
          recentUsers.slice(0, 3).forEach(user => {
            const timeDiff = this.getTimeDifference(user.created_at)
            this.recentActivities.push({
              text: `New user registered: ${user.email}`,
              time: timeDiff,
              icon: 'mdi-account-plus',
              color: '#4CAF50',
              type: 'success'
            })
          })
        }

        this.recentActivities.push(
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

        this.recentActivities = this.recentActivities.slice(0, 6)

      } catch (error) {
        console.error('Error fetching activities:', error)
      }
    },

    async fetchIncidentReports() {
      try {
        const { count: incidents, error: incidentError } = await supabase
          .from('incidents')
          .select('id', { count: 'exact' })

        if (!incidentError) {
          this.incidentCount = incidents || 0
        } else {
          this.incidentCount = 0
        }

        const { count: reports, error: reportError } = await supabase
          .from('reports')
          .select('id', { count: 'exact' })

        if (!reportError) {
          this.reportCount = reports || 0
        } else {
          this.reportCount = 0
        }

      } catch (error) {
        console.error('Error fetching incident reports:', error)
        this.incidentCount = 0
        this.reportCount = 0
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

    setupAuthStateListener() {
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (event === 'SIGNED_OUT' || !session) {
          this.$router.push('/')
        } else if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_super_admin')
            .eq('id', session.user.id)
            .single()

          if (!profile?.is_super_admin) {
            await supabase.auth.signOut()
            this.$router.push('/')
          }
        }
      })
    },

    logout() {
      this.logoutDialog = true
    },

    async confirmLogout() {
      this.loading = true
      this.logoutDialog = false
      
      try {
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          this.showMessage('Logout failed: ' + error.message, 'error')
        } else {
          this.showMessage('Successfully signed out', 'success')
          
          this.showContent = false
          
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        }
      } catch (error) {
        console.error('Logout error:', error)
        this.showMessage('Logout failed: ' + error.message, 'error')
      } finally {
        this.loading = false
      }
    },

    showMessage(text, color = 'info') {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
/* Background */
.dashboard-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: #0a0a0a;
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 152, 0, 0.08) 0%, transparent 50%);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: #FF6B35;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: #FF9800;
  top: 60%;
  right: 15%;
  animation-delay: 5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: #FF6B35;
  bottom: 10%;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.main-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

/* Sidebar */
.modern-sidebar {
  backdrop-filter: blur(20px);
  background: rgba(15, 15, 15, 0.95) !important;
  border-right: 1px solid rgba(255, 107, 53, 0.1);
  transition: all 0.3s ease;
}

.sidebar-header {
  padding: 24px 16px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-container:hover {
  transform: translateX(4px);
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 107, 53, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1;
}

.logo-subtitle {
  font-size: 11px;
  font-weight: 500;
  color: #999;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 4px;
}

.sidebar-divider {
  border-color: rgba(255, 107, 53, 0.1) !important;
  margin: 0 16px;
}

.sidebar-menu {
  padding: 16px 12px;
}

.menu-item {
  margin-bottom: 8px;
  color: #999 !important;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(255, 107, 53, 0.1) !important;
  color: #FF6B35 !important;
}

.menu-item.v-list-item--active {
  background: rgba(255, 107, 53, 0.15) !important;
  color: #FF6B35 !important;
  border-left: 3px solid #FF6B35;
}

.sidebar-footer {
  padding: 16px 12px;
}

.logout-item {
  color: #f44336 !important;
}

.logout-item:hover {
  background: rgba(244, 67, 54, 0.1) !important;
}

/* Top Navbar */
.top-navbar {
  backdrop-filter: blur(20px);
  background: rgba(15, 15, 15, 0.8) !important;
  border-bottom: 1px solid rgba(255, 107, 53, 0.1);
}

.menu-toggle {
  margin-right: 16px;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.search-container {
  max-width: 400px;
  margin: 0 24px;
}

.search-field {
  background: rgba(255, 255, 255, 0.05) !important;
  border-radius: 12px;
}

.search-field :deep(.v-field) {
  background: transparent !important;
  box-shadow: none !important;
}

.search-field :deep(.v-field__input) {
  color: #fff;
  padding: 8px 16px;
}

.search-field :deep(.v-field__input)::placeholder {
  color: #666;
}

.nav-action-btn {
  margin: 0 8px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 16px;
}

.user-profile:hover {
  background: rgba(255, 107, 53, 0.15);
  border-color: rgba(255, 107, 53, 0.3);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 107, 53, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 1;
}

.user-email-short {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu-dropdown {
  background: rgba(20, 20, 20, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  margin-top: 8px;
}

/* Content Container */
.content-container {
  padding: 32px;
}

/* Breadcrumb */
.breadcrumb-section {
  margin-bottom: 24px;
}

.custom-breadcrumb {
  padding: 0;
}

.custom-breadcrumb :deep(.v-breadcrumbs-item) {
  color: #999;
  font-size: 14px;
}

.custom-breadcrumb :deep(.v-breadcrumbs-item--disabled) {
  color: #FF6B35;
  opacity: 1;
}

/* Welcome Header */
.welcome-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 107, 53, 0.15);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.welcome-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.welcome-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.welcome-badge {
  width: 64px;
  height: 64px;
  background: rgba(255, 107, 53, 0.15);
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.welcome-text-content {
  flex: 1;
}

.welcome-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.welcome-subtitle {
  font-size: 15px;
  color: #999;
  font-weight: 400;
}

.welcome-actions {
  display: flex;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.action-button {
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 24px !important;
  transition: all 0.3s ease !important;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4) !important;
}

.action-button-outlined {
  border-radius: 12px !important;
  border-color: rgba(255, 107, 53, 0.3) !important;
  color: #FF6B35 !important;
  text-transform: none !important;
  font-weight: 600 !important;
  padding: 0 24px !important;
  transition: all 0.3s ease !important;
}

.action-button-outlined:hover {
  background: rgba(255, 107, 53, 0.1) !important;
  border-color: rgba(255, 107, 53, 0.5) !important;
  transform: translateY(-2px);
}

/* Stat Cards */
.stat-card {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  backdrop-filter: blur(10px);
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-8px);
  border-color: rgba(255, 107, 53, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stat-icon-box {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-primary {
  background: rgba(255, 107, 53, 0.15);
}

.icon-success {
  background: rgba(76, 175, 80, 0.15);
}

.icon-warning {
  background: rgba(255, 152, 0, 0.15);
}

.icon-neutral {
  background: rgba(117, 117, 117, 0.15);
}

.stat-body {
  margin-bottom: 16px;
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #999;
  font-weight: 500;
}

.stat-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.stat-trend.up {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

.stat-trend.neutral {
  background: rgba(117, 117, 117, 0.15);
  color: #999;
}

.stat-period {
  font-size: 11px;
  color: #666;
}

.stat-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #FF9800);
  border-radius: 2px;
  transition: width 1s ease;
}

/* Dashboard Cards */
.dashboard-card {
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  overflow: hidden;
  transition: all 0.3s ease;
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
  padding: 24px;
}

/* System Status Items */
.status-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
}

.status-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 107, 53, 0.2);
  transform: translateY(-2px);
}

.status-item-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.status-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.status-online {
  background: rgba(76, 175, 80, 0.15);
}

.status-info {
  flex: 1;
}

.status-name {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.status-value {
  font-size: 13px;
  color: #4CAF50;
  font-weight: 500;
}

.status-metrics {
  display: flex;
  gap: 24px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

/* Action Tiles */
.action-tile {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.action-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.1), transparent);
  transition: left 0.5s ease;
}

.action-tile:hover::before {
  left: 100%;
}

.action-tile:hover {
  transform: translateX(8px);
  border-color: rgba(255, 107, 53, 0.3);
  background: rgba(255, 255, 255, 0.04);
}

.action-tile-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 107, 53, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-tile-content {
  flex: 1;
}

.action-tile-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.action-tile-count {
  font-size: 20px;
  font-weight: 700;
  color: #FF6B35;
}

.action-tile-arrow {
  transition: transform 0.3s ease;
}

.action-tile:hover .action-tile-arrow {
  transform: translateX(4px);
}

/* Activity List */
.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.02);
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

.activity-content {
  flex: 1;
}

.activity-text {
  font-size: 14px;
  color: #fff;
  margin-bottom: 4px;
  line-height: 1.5;
}

.activity-time {
  font-size: 12px;
  color: #666;
}

.no-activity {
  text-align: center;
  padding: 40px 24px;
  color: #666;
}

.no-activity p {
  margin-top: 12px;
  font-size: 14px;
}

/* Info List */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #999;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

/* Dialog */
.modern-dialog {
  width: 100% !important;
  max-width: 400px !important;
}

.dialog-content {
  padding: 32px !important;
  width: 100% !important;
}

.dialog-header {
  text-align: center;
  margin-bottom: 32px;
}

.dialog-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: rgba(255, 107, 53, 0.15);
  border: 2px solid rgba(255, 107, 53, 0.3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.dialog-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.dialog-subtitle {
  font-size: 15px;
  color: #999;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}

.cancel-btn, .confirm-btn {
  height: 44px !important;
  border-radius: 12px !important;
  text-transform: none !important;
  font-weight: 600 !important;  
  font-size: 14px !important;
}

/* Snackbar */
.custom-snackbar {
  backdrop-filter: blur(20px);
}

.snackbar-content {
  display: flex;
  align-items: center;
  font-weight: 500;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(20, 20, 20, 0.5);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 107, 53, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 107, 53, 0.5);
}

/* Responsive Design */
@media (max-width: 1280px) {
  .welcome-title {
    font-size: 24px;
  }
  
  .content-container {
    padding: 24px;
  }
}

@media (max-width: 960px) {
  .welcome-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .welcome-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .action-button,
  .action-button-outlined {
    width: 100%;
  }
  
  .search-container {
    display: none;
  }
  
  .user-details {
    display: none;
  }
  
  .stat-value {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .content-container {
    padding: 16px;
  }
  
  .welcome-header {
    padding: 24px;
  }
  
  .welcome-title {
    font-size: 20px;
  }
  
  .welcome-subtitle {
    font-size: 13px;
  }
  
  .stat-card {
    padding: 20px;
  }
  
  .stat-icon-box {
    width: 48px;
    height: 48px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .card-header {
    padding: 20px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .action-tile {
    padding: 16px;
  }
  
  .action-tile-icon {
    width: 48px;
    height: 48px;
  }
  
  .action-tile-title {
    font-size: 14px;
  }
  
  .action-tile-count {
    font-size: 18px;
  }
  
  .modern-dialog {
    padding: 28px;
  }
  
  .dialog-icon-wrapper {
    width: 64px;
    height: 64px;
  }
  
  .dialog-title {
    font-size: 20px;
  }
  
  .dialog-actions {
    flex-direction: column;
  }
  
  .user-profile {
    padding: 6px 12px;
  }
  
  .user-avatar {
    width: 32px;
    height: 32px;
  }
}

/* Focus States */
.action-tile:focus-visible,
.stat-card:focus-visible,
.status-item:focus-visible {
  outline: 2px solid #FF6B35;
  outline-offset: 2px;
}

/* Loading States */
.v-btn--loading {
  pointer-events: none;
}

/* Print Styles */
@media print {
  .dashboard-background,
  .modern-sidebar,
  .top-navbar,
  .action-tile,
  .welcome-actions {
    display: none;
  }
  
  .stat-card,
  .dashboard-card {
    break-inside: avoid;
  }
  
  .main-content {
    padding: 0;
  }
}
</style>