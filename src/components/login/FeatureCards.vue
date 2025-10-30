<template>
  <div class="feature-cards">
    <div 
      class="feature-card" 
      v-for="(feature, index) in features" 
      :key="index" 
      :style="{ animationDelay: `${index * 0.1}s` }"
    >
      <div class="feature-icon-wrapper">
        <v-icon size="28" color="#FF6B35">{{ feature.icon }}</v-icon>
      </div>
      <div class="feature-text">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeatureCards',
  data() {
    return {
      features: [
        {
          icon: 'mdi-chart-line',
          title: 'Real-time Analytics',
          description: 'Monitor system performance and user activity'
        },
        {
          icon: 'mdi-security',
          title: 'Advanced Security',
          description: 'Enterprise-grade protection and compliance'
        },
        {
          icon: 'mdi-account-group',
          title: 'User Management',
          description: 'Complete control over user permissions'
        }
      ]
    }
  }
}
</script>

<style scoped>
.feature-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  animation: slideInLeft 0.8s ease-out backwards;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.feature-card:hover {
  background: rgba(20, 20, 20, 0.8);
  transform: translateX(10px);
  border-color: rgba(255, 107, 53, 0.4);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.feature-icon-wrapper {
  width: 56px;
  height: 56px;
  background: rgba(255, 107, 53, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-text h3 {
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-text p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
}

@media (max-width: 1200px) {
  .feature-cards {
    margin-bottom: 30px;
  }
}

@media (max-width: 600px) {
  .feature-card {
    padding: 18px;
  }
}
</style>