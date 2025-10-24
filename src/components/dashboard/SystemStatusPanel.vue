<template>
  <div class="dashboard-card">
    <div class="card-header">
      <div class="card-title-group">
        <v-icon color="#FF6B35" size="24" class="mr-3">mdi-pulse</v-icon>
        <div>
          <h3 class="card-title">System Status</h3>
          <p class="card-subtitle">Real-time monitoring</p>
        </div>
      </div>
      <v-chip :color="overallStatusColor" size="small" variant="flat">
        <v-icon size="12" class="mr-1">mdi-circle</v-icon>
        {{ overallStatusText }}
      </v-chip>
    </div>
    <div class="card-body">
      <v-row>
        <v-col 
          cols="12" 
          sm="6" 
          v-for="(status, index) in systemStatus" 
          :key="index"
        >
          <div class="status-item" @click="handleStatusClick(status)">
            <div class="status-item-header">
              <div class="status-icon" :class="`status-${status.statusClass}`">
                <v-icon :color="status.iconColor" size="20">{{ status.icon }}</v-icon>
              </div>
              <div class="status-info">
                <div class="status-name">{{ status.title }}</div>
                <div class="status-value" :style="{ color: status.iconColor }">
                  {{ status.status }}
                </div>
              </div>
            </div>
            <div class="status-metrics">
              <div class="metric-item">
                <span class="metric-label">Uptime</span>
                <span class="metric-value">{{ status.uptime || '99.9%' }}</span>
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
</template>

<script>
export default {
  name: 'SystemStatusPanel',
  data() {
    return {
      systemStatus: [
        { 
          title: 'System Health', 
          status: 'Operational', 
          icon: 'mdi-server', 
          iconColor: '#4CAF50', 
          statusClass: 'online',
          response: 45,
          uptime: '99.9%'
        },
        { 
          title: 'Database', 
          status: 'Connected', 
          icon: 'mdi-database', 
          iconColor: '#2196F3', 
          statusClass: 'online',
          response: 23,
          uptime: '99.8%'
        },
        { 
          title: 'Security', 
          status: 'Protected', 
          icon: 'mdi-shield-lock', 
          iconColor: '#FF9800', 
          statusClass: 'online',
          response: 12,
          uptime: '100%'
        },
        { 
          title: 'API Services', 
          status: 'Active', 
          icon: 'mdi-api', 
          iconColor: '#FF6B35', 
          statusClass: 'online',
          response: 67,
          uptime: '99.7%'
        }
      ]
    }
  },
  computed: {
    overallStatusColor() {
      const allOnline = this.systemStatus.every(s => s.statusClass === 'online')
      if (allOnline) return 'success'
      
      const anyOffline = this.systemStatus.some(s => s.statusClass === 'offline')
      if (anyOffline) return 'error'
      
      return 'warning'
    },
    overallStatusText() {
      const allOnline = this.systemStatus.every(s => s.statusClass === 'online')
      if (allOnline) return 'All Systems Operational'
      
      const anyOffline = this.systemStatus.some(s => s.statusClass === 'offline')
      if (anyOffline) return 'Systems Degraded'
      
      return 'Partial Outage'
    }
  },
  methods: {
    handleStatusClick(status) {
      this.$emit('status-clicked', status)
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

.status-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
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

.status-warning {
  background: rgba(255, 152, 0, 0.15);
}

.status-offline {
  background: rgba(244, 67, 54, 0.15);
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

@media (max-width: 600px) {
  .card-header {
    padding: 20px;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .status-item {
    padding: 16px;
  }
  
  .status-icon {
    width: 40px;
    height: 40px;
  }
  
  .status-metrics {
    gap: 16px;
  }
}
</style>