<template>
  <transition name="fade-slide">
    <div class="welcome-header mb-8">
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
</template>

<script>
export default {
  name: 'WelcomeHeader'
}
</script>

<style scoped>
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
}

@media (max-width: 600px) {
  .welcome-header {
    padding: 24px;
  }
  
  .welcome-title {
    font-size: 20px;
  }
  
  .welcome-subtitle {
    font-size: 13px;
  }
}
</style>