<template>
  <transition name="fade-slide">
    <div class="dashboard-card mt-6">
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
</template>

<script>
export default {
  name: 'SystemInfoCard'
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