<template>
  <v-row class="mb-8">
    <v-col cols="12" sm="6" lg="3" v-for="(stat, index) in statistics" :key="index">
      <transition name="fade-slide" :style="{ transitionDelay: `${index * 50}ms` }">
        <div class="stat-card" :class="`stat-${stat.type}`">
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
</template>

<script>
export default {
  name: 'StatisticsCards',
  props: {
    statistics: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
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
</style>