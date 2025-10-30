<template>
  <div class="login-container">
    <AnimatedBackground />
    
    <div class="login-wrapper">
      <transition name="slide-left">
        <BrandingSection v-show="showContent" />
      </transition>
      
      <transition name="slide-right">
        <LoginFormSection 
          v-show="showContent"
          @login-success="handleLoginSuccess"
        />
      </transition>
    </div>
  </div>
</template>

<script>
import AnimatedBackground from '@/components/login/AnimatedBackground.vue'
import BrandingSection from '@/components/login/BrandingSection.vue'
import LoginFormSection from '@/components/login/LoginFormSection.vue'

export default {
  name: 'LoginView',
  components: {
    AnimatedBackground,
    BrandingSection,
    LoginFormSection
  },
  data() {
    return {
      showContent: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.showContent = true
    }, 200)
  },
  methods: {
    handleLoginSuccess() {
      setTimeout(() => {
        this.showContent = false
      }, 1000)
    }
  }
}
</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.login-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100vh;
}

/* Animations */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-100px);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(50px);
}

/* Responsive */
@media (max-width: 1200px) {
  .login-wrapper {
    flex-direction: column;
  }
}
</style>