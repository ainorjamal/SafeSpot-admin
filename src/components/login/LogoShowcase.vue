<template>
  <div class="logo-showcase">
    <div class="logo-ring"></div>
    <div class="logo-ring-2"></div>
    <v-icon size="120" color="#FF6B35" class="logo-icon-large">mdi-shield-crown</v-icon>
  </div>
</template>

<script>
export default {
  name: 'LogoShowcase'
}
</script>

<style scoped>
.logo-showcase {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-ring,
.logo-ring-2 {
  position: absolute;
  border: 2px solid rgba(255, 107, 53, 0.2);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.logo-ring {
  width: 180px;
  height: 180px;
  border-top-color: rgba(255, 107, 53, 0.6);
  border-right-color: rgba(255, 107, 53, 0.6);
}

.logo-ring-2 {
  width: 220px;
  height: 220px;
  border-bottom-color: rgba(255, 152, 0, 0.4);
  border-left-color: rgba(255, 152, 0, 0.4);
  animation-direction: reverse;
  animation-duration: 15s;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-icon-large {
  position: relative;
  filter: drop-shadow(0 8px 24px rgba(255, 107, 53, 0.4));
  animation: floatLogo 3s ease-in-out infinite;
}

@keyframes floatLogo {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@media (max-width: 1200px) {
  .logo-showcase {
    width: 140px;
    height: 140px;
    margin-bottom: 30px;
  }
  
  .logo-ring {
    width: 140px;
    height: 140px;
  }
  
  .logo-ring-2 {
    width: 170px;
    height: 170px;
  }
  
  .logo-icon-large {
    font-size: 90px !important;
  }
}
</style>