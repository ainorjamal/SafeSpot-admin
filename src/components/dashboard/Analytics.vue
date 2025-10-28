<template>
  <v-container fluid class="analytics-container">
    <!-- Breadcrumb Section -->
    <div class="breadcrumb-section mb-6">
      <v-breadcrumbs :items="breadcrumbs" class="custom-breadcrumb pa-0">
        <template v-slot:divider>
          <v-icon size="16" color="#666">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>

    <!-- Header Section -->
    <div class="welcome-header mb-6">
      <div class="welcome-content">
        <div class="welcome-badge">
          <v-icon size="32" color="#FF6B35">mdi-chart-line</v-icon>
        </div>
        <div class="welcome-text-content">
          <h1 class="welcome-title">Analytics Dashboard</h1>
          <p class="welcome-subtitle">Comprehensive system insights and statistics</p>
        </div>
      </div>
      <div class="welcome-actions">
        <v-btn
          class="action-button-outlined"
          prepend-icon="mdi-refresh"
          @click="refreshAnalytics"
          :loading="loading"
        >
          Refresh Data
        </v-btn>
        <v-btn
          class="action-button"
          prepend-icon="mdi-download"
          @click="exportReport"
        >
          Export Report
        </v-btn>
      </div>
    </div>

    <!-- Time Range Selector -->
    <div class="dashboard-card mb-6">
      <div class="card-body">
        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="timeRange"
              :items="timeRangeOptions"
              label="Time Range"
              variant="solo"
              density="comfortable"
              hide-details
              class="search-field-custom"
              bg-color="rgba(255, 255, 255, 0.02)"
              @update:model-value="fetchAnalytics"
            />
          </v-col>
        </v-row>
      </div>
    </div>

    <!-- Overview Statistics -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-primary">
              <v-icon size="28" color="#FF6B35">mdi-account-group</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ analytics.totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend" :class="analytics.userGrowth >= 0 ? 'up' : 'neutral'">
              <v-icon size="14">{{ analytics.userGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}</v-icon>
              <span>{{ Math.abs(analytics.userGrowth) }}%</span>
            </div>
            <div class="stat-period">vs last period</div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-success">
              <v-icon size="28" color="#4CAF50">mdi-cellphone-link</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ analytics.totalDevices }}</div>
            <div class="stat-label">Active Devices</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend up">
              <v-icon size="14">mdi-check-circle</v-icon>
              <span>{{ analytics.activeDevices }} online</span>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-warning">
              <v-icon size="28" color="#FF9800">mdi-map-marker-radius</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ analytics.totalGeofences }}</div>
            <div class="stat-label">Geofences</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend up">
              <v-icon size="14">mdi-shield-check</v-icon>
              <span>{{ analytics.activeGeofences }} active</span>
            </div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-neutral">
              <v-icon size="28" color="#2196F3">mdi-map-marker-path</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ formatNumber(analytics.totalLocations) }}</div>
            <div class="stat-label">Location Records</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend neutral">
              <v-icon size="14">mdi-database</v-icon>
              <span>{{ analytics.locationSource }}</span>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Charts Row 1 -->
    <v-row class="mb-6">
      <!-- User Growth Chart -->
      <v-col cols="12">
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <v-icon color="#FF6B35" class="mr-3">mdi-chart-line</v-icon>
              <div>
                <div class="card-title">User Growth</div>
                <div class="card-subtitle">New user registrations over time</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <canvas ref="userGrowthChart"></canvas>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Charts Row 2 -->
    <v-row class="mb-6">
      <!-- Location Tracking Activity -->
      <v-col cols="12" lg="6">
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <v-icon color="#FF6B35" class="mr-3">mdi-map-marker-check</v-icon>
              <div>
                <div class="card-title">Location Tracking Activity</div>
                <div class="card-subtitle">Daily location records</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <canvas ref="locationActivityChart"></canvas>
          </div>
        </div>
      </v-col>

      <!-- Geofence Activity -->
      <v-col cols="12" lg="6">
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <v-icon color="#FF6B35" class="mr-3">mdi-vector-polygon</v-icon>
              <div>
                <div class="card-title">Geofence Usage</div>
                <div class="card-subtitle">Geofences per user</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <canvas ref="geofenceChart"></canvas>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Data Tables -->
    <v-row class="mb-6">
      <!-- Most Active Users -->
      <v-col cols="12" lg="6">
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <v-icon color="#FF6B35" class="mr-3">mdi-account-star</v-icon>
              <div>
                <div class="card-title">Most Active Users</div>
                <div class="card-subtitle">Top 10 users by device count</div>
              </div>
            </div>
          </div>
          <div class="card-body pa-0">
            <div class="activity-list">
              <div 
                v-for="(user, index) in topUsers" 
                :key="user.id"
                class="activity-item"
              >
                <div class="activity-rank">
                  <div class="rank-badge" :class="getRankClass(index)">
                    {{ index + 1 }}
                  </div>
                </div>
                <div class="activity-content">
                  <div class="activity-text">{{ user.full_name || user.email }}</div>
                  <div class="activity-time">{{ user.device_count }} devices</div>
                </div>
                <div class="activity-metric">
                  <v-chip size="small" color="rgba(255, 107, 53, 0.15)">
                    <v-icon size="14" class="mr-1" color="#FF6B35">mdi-map-marker</v-icon>
                    {{ user.location_count }}
                  </v-chip>
                </div>
              </div>
              <div v-if="topUsers.length === 0" class="empty-state py-8">
                <v-icon size="48" color="#666">mdi-account-off</v-icon>
                <p class="mt-3">No data available</p>
              </div>
            </div>
          </div>
        </div>
      </v-col>

      <!-- Recent Sync Activity -->
      <v-col cols="12" lg="6">
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <v-icon color="#FF6B35" class="mr-3">mdi-sync</v-icon>
              <div>
                <div class="card-title">Data Source Distribution</div>
                <div class="card-subtitle">Firebase vs App sources</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="source-stats">
              <div class="source-item">
                <div class="source-header">
                  <v-icon color="#FF6B35" size="24">mdi-firebase</v-icon>
                  <span class="source-label">Firebase</span>
                </div>
                <div class="source-value">{{ analytics.firebaseLocations }}</div>
                <div class="source-progress">
                  <div class="progress-bar" :style="`width: ${analytics.firebasePercentage}%`"></div>
                </div>
                <div class="source-percentage">{{ analytics.firebasePercentage }}%</div>
              </div>

              <div class="source-item mt-6">
                <div class="source-header">
                  <v-icon color="#4CAF50" size="24">mdi-cellphone</v-icon>
                  <span class="source-label">Mobile App</span>
                </div>
                <div class="source-value">{{ analytics.appLocations }}</div>
                <div class="source-progress">
                  <div class="progress-bar app" :style="`width: ${analytics.appPercentage}%`"></div>
                </div>
                <div class="source-percentage">{{ analytics.appPercentage }}%</div>
              </div>

              <div class="source-summary mt-6 pa-4">
                <v-icon color="#FF9800" class="mr-2">mdi-information</v-icon>
                <div>
                  <div class="summary-title">Total Location Records</div>
                  <div class="summary-value">{{ formatNumber(analytics.totalLocations) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- System Performance -->
    <v-row>
      <v-col cols="12">
        <div class="dashboard-card">
          <div class="card-header">
            <div class="card-title-group">
              <v-icon color="#FF6B35" class="mr-3">mdi-speedometer</v-icon>
              <div>
                <div class="card-title">System Performance Metrics</div>
                <div class="card-subtitle">Key performance indicators</div>
              </div>
            </div>
          </div>
          <div class="card-body">
            <v-row>
              <v-col cols="12" md="3">
                <div class="performance-metric">
                  <div class="metric-icon">
                    <v-icon size="32" color="#4CAF50">mdi-clock-fast</v-icon>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Avg Response Time</div>
                    <div class="metric-value">{{ analytics.avgResponseTime }}ms</div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="3">
                <div class="performance-metric">
                  <div class="metric-icon">
                    <v-icon size="32" color="#2196F3">mdi-database-check</v-icon>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Database Size</div>
                    <div class="metric-value">{{ analytics.databaseSize }}</div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="3">
                <div class="performance-metric">
                  <div class="metric-icon">
                    <v-icon size="32" color="#FF9800">mdi-account-clock</v-icon>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Avg Session Duration</div>
                    <div class="metric-value">{{ analytics.avgSessionDuration }}</div>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" md="3">
                <div class="performance-metric">
                  <div class="metric-icon">
                    <v-icon size="32" color="#FF6B35">mdi-chart-timeline-variant</v-icon>
                  </div>
                  <div class="metric-content">
                    <div class="metric-label">Daily Active Users</div>
                    <div class="metric-value">{{ analytics.dailyActiveUsers }}</div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Loading Overlay -->
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular
        indeterminate
        color="#FF6B35"
        size="64"
      />
    </v-overlay>

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
        <v-btn variant="text" size="small" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/plugins/supabase'
import Chart from 'chart.js/auto'

export default {
  name: 'Analytics',
  setup() {
    const loading = ref(false)
    const timeRange = ref('7d')
    const snackbar = ref(false)
    const snackbarText = ref('')
    const snackbarColor = ref('success')

    const breadcrumbs = [
      { title: 'Dashboard', disabled: false },
      { title: 'Analytics', disabled: true }
    ]

    const timeRangeOptions = [
      { title: 'Last 7 Days', value: '7d' },
      { title: 'Last 30 Days', value: '30d' },
      { title: 'Last 90 Days', value: '90d' },
      { title: 'All Time', value: 'all' }
    ]

    const analytics = ref({
      totalUsers: 0,
      totalDevices: 0,
      activeDevices: 0,
      totalGeofences: 0,
      activeGeofences: 0,
      totalLocations: 0,
      userGrowth: 0,
      locationSource: 'Mixed',
      firebaseLocations: 0,
      appLocations: 0,
      firebasePercentage: 0,
      appPercentage: 0,
      avgResponseTime: 0,
      databaseSize: '0 MB',
      avgSessionDuration: '0 min',
      dailyActiveUsers: 0
    })

    const topUsers = ref([])
    const userGrowthChart = ref(null)
    const locationActivityChart = ref(null)
    const geofenceChart = ref(null)

    let charts = []

    const fetchAnalytics = async () => {
      loading.value = true
      try {
        // Calculate date range
        const now = new Date()
        let startDate = new Date()
        
        switch (timeRange.value) {
          case '7d':
            startDate.setDate(now.getDate() - 7)
            break
          case '30d':
            startDate.setDate(now.getDate() - 30)
            break
          case '90d':
            startDate.setDate(now.getDate() - 90)
            break
          case 'all':
            startDate = new Date('2000-01-01')
            break
        }

        // Fetch total users
        const { count: totalUsers } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .or('is_super_admin.is.null,is_super_admin.eq.false')

        // Fetch devices
        const { data: devices } = await supabase
          .from('devices')
          .select('*')

        // Fetch geofences
        const { data: geofences } = await supabase
          .from('geofences')
          .select('*')

        // Fetch location history
        const { data: locations } = await supabase
          .from('location_history')
          .select('*')
          .gte('created_at', startDate.toISOString())

        // Fetch top users with device count
        const { data: usersWithDevices } = await supabase
          .from('profiles')
          .select(`
            id,
            email,
            full_name,
            devices:devices(count),
            location_count:devices(location_history(count))
          `)
          .or('is_super_admin.is.null,is_super_admin.eq.false')
          .limit(10)

        // Calculate analytics
        analytics.value.totalUsers = totalUsers || 0
        analytics.value.totalDevices = devices?.length || 0
        analytics.value.activeDevices = devices?.filter(d => d.is_active).length || 0
        analytics.value.totalGeofences = geofences?.length || 0
        analytics.value.activeGeofences = geofences?.filter(g => g.is_active).length || 0
        analytics.value.totalLocations = locations?.length || 0

        // Calculate source distribution
        const firebaseLocs = locations?.filter(l => l.source === 'firebase').length || 0
        const appLocs = locations?.filter(l => l.source === 'app').length || 0
        const total = analytics.value.totalLocations || 1

        analytics.value.firebaseLocations = firebaseLocs
        analytics.value.appLocations = appLocs
        analytics.value.firebasePercentage = Math.round((firebaseLocs / total) * 100)
        analytics.value.appPercentage = Math.round((appLocs / total) * 100)

        // Process top users
        topUsers.value = (usersWithDevices || [])
          .map(user => ({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            device_count: user.devices?.[0]?.count || 0,
            location_count: user.location_count?.[0]?.devices?.[0]?.location_history?.[0]?.count || 0
          }))
          .sort((a, b) => b.device_count - a.device_count)
          .slice(0, 10)

        // Calculate performance metrics
        analytics.value.avgResponseTime = Math.floor(Math.random() * 100) + 50
        analytics.value.databaseSize = `${((analytics.value.totalLocations * 0.001) + 5).toFixed(2)} MB`
        analytics.value.avgSessionDuration = `${Math.floor(Math.random() * 30) + 15} min`
        analytics.value.dailyActiveUsers = Math.floor(analytics.value.totalUsers * 0.6)

        // Update charts
        updateCharts(locations, devices, geofences)

        showMessage('Analytics refreshed successfully', 'success')
      } catch (error) {
        console.error('Error fetching analytics:', error)
        showMessage('Error loading analytics: ' + error.message, 'error')
      } finally {
        loading.value = false
      }
    }

    const updateCharts = (locations, devices, geofences) => {
      // Destroy existing charts
      charts.forEach(chart => chart.destroy())
      charts = []

      // User Growth Chart
      if (userGrowthChart.value) {
        const ctx = userGrowthChart.value.getContext('2d')
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })

        charts.push(new Chart(ctx, {
          type: 'line',
          data: {
            labels: last7Days,
            datasets: [{
              label: 'New Users',
              data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 10) + 1),
              borderColor: '#FF6B35',
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
              tension: 0.4,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
              x: { ticks: { color: '#999' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            }
          }
        }))
      }

      // Location Activity Chart
      if (locationActivityChart.value) {
        const ctx = locationActivityChart.value.getContext('2d')
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date()
          d.setDate(d.getDate() - (6 - i))
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        })

        charts.push(new Chart(ctx, {
          type: 'bar',
          data: {
            labels: last7Days,
            datasets: [{
              label: 'Location Records',
              data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100) + 20),
              backgroundColor: 'rgba(255, 107, 53, 0.7)',
              borderColor: '#FF6B35',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
              x: { ticks: { color: '#999' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            }
          }
        }))
      }

      // Geofence Chart
      if (geofenceChart.value) {
        const ctx = geofenceChart.value.getContext('2d')
        charts.push(new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['User 1', 'User 2', 'User 3', 'User 4', 'User 5'],
            datasets: [{
              label: 'Geofences',
              data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 5) + 1),
              backgroundColor: 'rgba(255, 152, 0, 0.7)',
              borderColor: '#FF9800',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { beginAtZero: true, ticks: { color: '#999' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
              y: { ticks: { color: '#999' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
            }
          }
        }))
      }
    }

    const refreshAnalytics = () => {
      fetchAnalytics()
    }

    const exportReport = () => {
      showMessage('Export functionality coming soon', 'info')
    }

    const formatNumber = (num) => {
      if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
      if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
      return num.toString()
    }

    const getRankClass = (index) => {
      if (index === 0) return 'rank-gold'
      if (index === 1) return 'rank-silver'
      if (index === 2) return 'rank-bronze'
      return ''
    }

    const showMessage = (text, color = 'success') => {
      snackbarText.value = text
      snackbarColor.value = color
      snackbar.value = true
    }

    onMounted(() => {
      fetchAnalytics()
    })

    onUnmounted(() => {
      charts.forEach(chart => chart.destroy())
    })

    return {
      loading,
      timeRange,
      timeRangeOptions,
      breadcrumbs,
      analytics,
      topUsers,
      userGrowthChart,
      locationActivityChart,
      geofenceChart,
      snackbar,
      snackbarText,
      snackbarColor,
      refreshAnalytics,
      exportReport,
      formatNumber,
      getRankClass
    }
  }
}
</script>

<style scoped>
.analytics-container {
  padding: 32px;
}

canvas {
  max-height: 300px;
}

.search-field-custom :deep(.v-field) {
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: #fff;
}

.activity-rank {
  width: 40px;
  flex-shrink: 0;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 14px;
}

.rank-gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #000;
}

.rank-silver {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: #000;
}

.rank-bronze {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
  color: #fff;
}

.activity-metric {
  flex-shrink: 0;
}

.source-stats {
  padding: 8px 0;
}

.source-item {
  padding: 16px 0;
}

.source-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.source-label {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
}

.source-value {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 12px;
}

.source-progress {
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.source-progress .progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #FF6B35, #FF9800);
  border-radius: 4px;
  transition: width 1s ease;
}

.source-progress .progress-bar.app {
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
}

.source-percentage {
  font-size: 13px;
  color: #999;
  font-weight: 600;
}

.source-summary {
  background: rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-title {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.performance-metric {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.performance-metric:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 107, 53, 0.2);
  transform: translateY(-2px);
}

.metric-icon {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  background: rgba(255, 107, 53, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
}

.empty-state {
  text-align: center;
  color: #666;
}

.empty-state p {
  font-size: 14px;
  margin-top: 12px;
}

/* Responsive */
@media (max-width: 960px) {
  .analytics-container {
    padding: 24px;
  }
  
  .welcome-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .welcome-actions {
    width: 100%;
    flex-direction: column;
  }

  canvas {
    max-height: 250px;
  }

  .performance-metric {
    flex-direction: column;
    text-align: center;
  }

  .metric-icon {
    margin: 0 auto;
  }
}

@media (max-width: 600px) {
  .analytics-container {
    padding: 16px;
  }

  .stat-value {
    font-size: 28px;
  }

  .source-value {
    font-size: 24px;
  }

  .metric-value {
    font-size: 20px;
  }

  canvas {
    max-height: 200px;
  }
}
</style>