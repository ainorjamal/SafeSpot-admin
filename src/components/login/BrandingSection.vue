<template>
  <div class="left-section">
    <div class="branding-content">
      <LogoShowcase />
      
      <h1 class="brand-title">SafeSpot</h1>
      <h2 class="brand-subtitle">Admin Control Center</h2>
      
      <FeatureCards />
      <StatsContainer />
    </div>
  </div>
</template>

<script>
import LogoShowcase from './LogoShowcase.vue'
import FeatureCards from './FeatureCards.vue'
import StatsContainer from './StatsContainer.vue'

export default {
  name: 'BrandingSection',
  components: {
    LogoShowcase,
    FeatureCards,
    StatsContainer
  }
}
</script>

<style scoped>
.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;
}

.branding-content {
  max-width: 600px;
  position: relative;
  z-index: 2;
}

.brand-title {
  font-size: 72px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-align: center;
  letter-spacing: -2px;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.brand-subtitle {
  font-size: 24px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 60px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

@media (max-width: 1200px) {
  .left-section {
    flex: 0 0 auto;
    min-height: 50vh;
    padding: 40px 30px;
  }
  
  .brand-title {
    font-size: 48px;
  }
  
  .brand-subtitle {
    font-size: 18px;
  }
}

@media (max-width: 600px) {
  .left-section {
    padding: 30px 20px;
  }
  
  .brand-title {
    font-size: 36px;
  }
  
  .brand-subtitle {
    font-size: 16px;
    margin-bottom: 40px;
  }
}
</style>