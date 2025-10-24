<template>
  <div class="dashboard-card">
    <div class="card-header">
      <div class="card-title-group">
        <v-icon color="#FF6B35" size="24" class="mr-3">mdi-lightning-bolt</v-icon>
        <div>
          <h3 class="card-title">Quick Actions</h3>
          <p class="card-subtitle">Frequently used tools</p>
        </div>
      </div>
      <v-chip color="success" size="small" variant="flat">
        <v-icon size="10" class="mr-1">mdi-circle</v-icon>
        {{ actions.length }} Available
      </v-chip>
    </div>
    <div class="card-body">
      <v-row>
        <v-col 
          cols="12" 
          sm="6" 
          md="4" 
          v-for="(action, index) in actions" 
          :key="index"
        >
          <transition name="action-fade" :style="{ transitionDelay: `${index * 50}ms` }">
            <div 
              class="action-tile" 
              @click="handleActionClick(action)"
              :class="{ 'action-disabled': action.disabled }"
              role="button"
              tabindex="0"
              @keypress.enter="handleActionClick(action)"
            >
              <div class="action-tile-icon" :style="{ background: `${action.color}15` }">
                <v-icon :color="action.color" size="28">{{ action.icon }}</v-icon>
              </div>
              <div class="action-tile-content">
                <div class="action-tile-title">{{ action.label }}</div>
                <div class="action-tile-count" :style="{ color: action.color }">
                  {{ action.count }}
                </div>
                <div v-if="action.subtitle" class="action-tile-subtitle">
                  {{ action.subtitle }}
                </div>
              </div>
              <v-icon class="action-tile-arrow" color="#666" size="20">
                mdi-arrow-right
              </v-icon>
              <div v-if="action.badge" class="action-badge">
                <v-chip :color="action.badgeColor || 'error'" size="x-small" variant="flat">
                  {{ action.badge }}
                </v-chip>
              </div>
            </div>
          </transition>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuickActionsPanel',
  props: {
    totalUsers: {
      type: Number,
      default: 0
    },
    incidentCount: {
      type: Number,
      default: 0
    },
    reportCount: {
      type: Number,
      default: 0
    }
  },
  computed: {
    actions() {
      return [
        { 
          label: 'Users', 
          icon: 'mdi-account-multiple', 
          color: '#FF6B35', 
          count: this.totalUsers,
          subtitle: 'Manage all users',
          action: 'users',
          badge: null
        },
        { 
          label: 'Incidents', 
          icon: 'mdi-alert-octagon', 
          color: '#f44336', 
          count: this.incidentCount,
          subtitle: 'View reports',
          action: 'incidents',
          badge: this.incidentCount > 0 ? 'New' : null,
          badgeColor: 'error'
        },
        { 
          label: 'Reports', 
          icon: 'mdi-file-chart', 
          color: '#2196F3', 
          count: this.reportCount,
          subtitle: 'Generate reports',
          action: 'reports',
          badge: null
        },
        { 
          label: 'Analytics', 
          icon: 'mdi-chart-line', 
          color: '#4CAF50', 
          count: 'View',
          subtitle: 'Data insights',
          action: 'analytics',
          badge: null
        },
        { 
          label: 'Settings', 
          icon: 'mdi-cog', 
          color: '#FF9800', 
          count: 'Config',
          subtitle: 'System settings',
          action: 'settings',
          badge: null
        },
        { 
          label: 'Backup', 
          icon: 'mdi-backup-restore', 
          color: '#9C27B0', 
          count: 'Run',
          subtitle: 'Data backup',
          action: 'backup',
          badge: null
        }
      ]
    }
  },
  methods: {
    handleActionClick(action) {
      if (action.disabled) return
      this.$emit('action-clicked', action.action)
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
  min-height: 100px;
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

.action-tile:focus-visible {
  outline: 2px solid #FF6B35;
  outline-offset: 2px;
}

.action-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-disabled:hover {
  transform: none;
  border-color: rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.action-tile-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-tile-content {
  flex: 1;
  min-width: 0;
}

.action-tile-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.action-tile-count {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 4px;
}

.action-tile-subtitle {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-tile-arrow {
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.action-tile:hover .action-tile-arrow {
  transform: translateX(4px);
}

.action-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.action-fade-enter-active {
  transition: all 0.4s ease;
}

.action-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 960px) {
  .action-tile {
    padding: 16px;
    min-height: 90px;
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
}

@media (max-width: 600px) {
  .card-header {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .card-body {
    padding: 20px;
  }
}
</style>