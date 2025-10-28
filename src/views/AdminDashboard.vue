<template>
  <v-app>
    <DashboardBackground />
    
    <DashboardSidebar
      v-model:drawer="drawer"
      v-model:rail="rail"
      v-model:activeMenu="activeMenu"
      :menu-items="menuItems"
      @logout="logout"
    />

    <DashboardTopbar
      v-model:rail="rail"
      v-model:search-query="searchQuery"
      :current-page-title="currentPageTitle"
      :user-email="userEmail"
      @logout="logout"
    />

    <v-main class="main-content">
      <!-- Dashboard Content (activeMenu === 'dashboard') -->
      <v-container v-if="activeMenu === 'dashboard'" fluid class="content-container">
        <div class="breadcrumb-section mb-6">
          <v-breadcrumbs :items="breadcrumbs" class="custom-breadcrumb pa-0">
            <template v-slot:divider>
              <v-icon size="16" color="#666">mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </div>

        <WelcomeHeader v-show="showContent" />

        <StatisticsCards
          v-show="showContent"
          :statistics="statistics"
        />

        <v-row>
          <v-col cols="12" lg="8">
            <SystemStatusPanel
              v-show="showContent"
              :system-status="systemStatus"
            />

            <QuickActionsPanel
              v-show="showContent"
              :quick-actions="quickActions"
            />
          </v-col>

          <v-col cols="12" lg="4">
            <ActivityFeed
              v-show="showContent"
              :recent-activities="recentActivities"
            />

            <SystemInfoCard v-show="showContent" />
          </v-col>
        </v-row>
      </v-container>

      <!-- Safety Map Content (activeMenu === 'map') -->
      <SafetyMap v-if="activeMenu === 'map'" />

      <!-- User Management Content (activeMenu === 'users') -->
      <UserManagement v-if="activeMenu === 'users'" />

      <!-- Analytics Content (activeMenu === 'analytics') -->
      <v-container v-if="activeMenu === 'analytics'" fluid class="content-container">
        <div class="breadcrumb-section mb-6">
          <v-breadcrumbs :items="analyticsBreadcrumbs" class="custom-breadcrumb pa-0">
            <template v-slot:divider>
              <v-icon size="16" color="#666">mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </div>
        <div class="welcome-header">
          <div class="welcome-content">
            <div class="welcome-badge">
              <v-icon size="32" color="#FF6B35">mdi-chart-line</v-icon>
            </div>
            <div class="welcome-text-content">
              <h1 class="welcome-title">Analytics</h1>
              <p class="welcome-subtitle">View detailed analytics and insights</p>
            </div>
          </div>
        </div>
      </v-container>

      <!-- Reports Content (activeMenu === 'reports') -->
      <v-container v-if="activeMenu === 'reports'" fluid class="content-container">
        <div class="breadcrumb-section mb-6">
          <v-breadcrumbs :items="reportsBreadcrumbs" class="custom-breadcrumb pa-0">
            <template v-slot:divider>
              <v-icon size="16" color="#666">mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </div>
        <div class="welcome-header">
          <div class="welcome-content">
            <div class="welcome-badge">
              <v-icon size="32" color="#FF6B35">mdi-file-chart</v-icon>
            </div>
            <div class="welcome-text-content">
              <h1 class="welcome-title">Reports</h1>
              <p class="welcome-subtitle">Generate and view system reports</p>
            </div>
          </div>
        </div>
      </v-container>

      <!-- Settings Content (activeMenu === 'settings') -->
      <v-container v-if="activeMenu === 'settings'" fluid class="content-container">
        <div class="breadcrumb-section mb-6">
          <v-breadcrumbs :items="settingsBreadcrumbs" class="custom-breadcrumb pa-0">
            <template v-slot:divider>
              <v-icon size="16" color="#666">mdi-chevron-right</v-icon>
            </template>
          </v-breadcrumbs>
        </div>
        <div class="welcome-header">
          <div class="welcome-content">
            <div class="welcome-badge">
              <v-icon size="32" color="#FF6B35">mdi-cog</v-icon>
            </div>
            <div class="welcome-text-content">
              <h1 class="welcome-title">Settings</h1>
              <p class="welcome-subtitle">Configure system settings and preferences</p>
            </div>
          </div>
        </div>
      </v-container>
    </v-main>

    <LogoutDialog
      v-model="logoutDialog"
      :loading="loading"
      @confirm="confirmLogout"
    />

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
        <v-btn variant="text" size="small" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import DashboardBackground from '@/components/dashboard/DashboardBackground.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardTopbar from '@/components/dashboard/DashboardTopbar.vue'
import WelcomeHeader from '@/components/dashboard/WelcomeHeader.vue'
import StatisticsCards from '@/components/dashboard/StatisticsCards.vue'
import SystemStatusPanel from '@/components/dashboard/SystemStatusPanel.vue'
import QuickActionsPanel from '@/components/dashboard/QuickActionsPanel.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import SystemInfoCard from '@/components/dashboard/SystemInfoCard.vue'
import LogoutDialog from '@/components/dashboard/LogoutDialog.vue'
import SafetyMap from '@/components/dashboard/SafetyMap.vue'
import UserManagement from '@/components/dashboard/UserManagement.vue'

import { useDashboardData } from '@/composables/useDashboardData'
import { useUserStats } from '@/composables/useUserStats'
import { useAuth } from '@/composables/useAuth'

export default {
  name: 'AdminDashboard',
  components: {
    DashboardBackground,
    DashboardSidebar,
    DashboardTopbar,
    WelcomeHeader,
    StatisticsCards,
    SystemStatusPanel,
    QuickActionsPanel,
    ActivityFeed,
    SystemInfoCard,
    LogoutDialog,
    SafetyMap,
    UserManagement
  },
  setup() {
    const {
      drawer,
      rail,
      searchQuery,
      activeMenu,
      showContent,
      menuItems,
      breadcrumbs,
      currentPageTitle
    } = useDashboardData()

    const {
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday,
      incidentCount,
      reportCount,
      statistics,
      quickActions,
      fetchAllStats
    } = useUserStats()

    const {
      userEmail,
      loading,
      logoutDialog,
      snackbar,
      snackbarText,
      snackbarColor,
      logout,
      confirmLogout,
      showMessage,
      initialize
    } = useAuth()

    return {
      drawer,
      rail,
      searchQuery,
      activeMenu,
      showContent,
      menuItems,
      breadcrumbs,
      currentPageTitle,
      totalUsers,
      activeUsers,
      inactiveUsers,
      newUsersToday,
      incidentCount,
      reportCount,
      statistics,
      quickActions,
      userEmail,
      loading,
      logoutDialog,
      snackbar,
      snackbarText,
      snackbarColor,
      logout,
      confirmLogout,
      showMessage,
      fetchAllStats,
      initialize
    }
  },
  data() {
    return {
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
      ],
      usersBreadcrumbs: [
        { title: 'Dashboard', disabled: false },
        { title: 'User Management', disabled: true }
      ],
      analyticsBreadcrumbs: [
        { title: 'Dashboard', disabled: false },
        { title: 'Analytics', disabled: true }
      ],
      reportsBreadcrumbs: [
        { title: 'Dashboard', disabled: false },
        { title: 'Reports', disabled: true }
      ],
      settingsBreadcrumbs: [
        { title: 'Dashboard', disabled: false },
        { title: 'Settings', disabled: true }
      ]
    }
  },
  computed: {
    currentBreadcrumbs() {
      const breadcrumbMap = {
        dashboard: this.breadcrumbs,
        map: [
          { title: 'Dashboard', disabled: false },
          { title: 'Safety Map', disabled: true }
        ],
        users: this.usersBreadcrumbs,
        analytics: this.analyticsBreadcrumbs,
        reports: this.reportsBreadcrumbs,
        settings: this.settingsBreadcrumbs
      }
      return breadcrumbMap[this.activeMenu] || this.breadcrumbs
    }
  },
  async mounted() {
    await this.initialize()
    await this.fetchAllStats()
    await this.fetchRecentActivities()
    
    setTimeout(() => {
      this.showContent = true
    }, 200)
  },
  methods: {
    async fetchRecentActivities() {
      // Import from composable or keep here
      // This method can be moved to a separate composable if needed
    }
  }
}
</script>

<style src="@/styles/dashboard.css"></style>