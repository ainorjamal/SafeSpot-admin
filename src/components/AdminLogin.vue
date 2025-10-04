<template>
  <div class="login-container">
    <!-- Animated Background -->
    <div class="dashboard-background">
      <div class="background-gradient"></div>
      <div class="grid-overlay"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
    </div>
    
    <div class="login-wrapper">
      <!-- Left Section - Branding & Info -->
      <transition name="slide-left">
        <div v-show="showContent" class="left-section">
          <div class="branding-content">
            <!-- Animated Logo -->
            <div class="logo-showcase">
              <div class="logo-ring"></div>
              <div class="logo-ring-2"></div>
              <v-icon size="120" color="#FF6B35" class="logo-icon-large">mdi-shield-crown</v-icon>
            </div>
            
            <!-- Main Heading -->
            <h1 class="brand-title">SafeSpot</h1>
            <h2 class="brand-subtitle">Admin Control Center</h2>
            
            <!-- Feature Cards -->
            <div class="feature-cards">
              <div class="feature-card" v-for="(feature, index) in features" :key="index" 
                   :style="{ animationDelay: `${index * 0.1}s` }">
                <div class="feature-icon-wrapper">
                  <v-icon size="28" color="#FF6B35">{{ feature.icon }}</v-icon>
                </div>
                <div class="feature-text">
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                </div>
              </div>
            </div>
            
            <!-- Decorative Stats -->
            <div class="stats-container">
              <div class="stat-item" v-for="(stat, index) in stats" :key="index">
                <div class="stat-number">{{ stat.number }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Right Section - Login Form -->
      <transition name="slide-right">
        <div v-show="showContent" class="right-section">
          <div class="form-container">
            <!-- Header -->
            <div class="form-header">
              <div class="header-icon-wrapper">
                <v-icon size="48" color="#FF6B35">mdi-shield-lock</v-icon>
              </div>
              <h1 class="form-title">Welcome Back</h1>
              <p class="form-subtitle">Sign in to access the admin dashboard</p>
            </div>

            <!-- Form Card -->
            <div class="login-card">
              <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
                <v-text-field
                  v-model="email"
                  label="Admin Email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  class="mb-4 custom-input"
                  color="#FF6B35"
                  required
                  :disabled="loading"
                ></v-text-field>
                
                <v-text-field
                  v-model="password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  :rules="[rules.required, rules.minLength]"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  class="mb-4 custom-input"
                  color="#FF6B35"
                  required
                  :disabled="loading"
                ></v-text-field>

                <!-- Admin Info Badge -->
                <div class="info-badge mb-4">
                  <v-icon size="20" class="mr-2" color="#FF6B35">mdi-shield-star</v-icon>
                  <span class="badge-text">Super Admin Access Required</span>
                </div>

                <!-- Loading Message -->
                <div v-if="loading && !errorMessage && !successMessage" class="alert-message info-message mb-4">
                  <v-progress-circular indeterminate size="20" color="#FF6B35" class="mr-2"></v-progress-circular>
                  <span>Verifying admin privileges...</span>
                </div>

                <!-- Error Message -->
                <div v-if="errorMessage" class="alert-message error-message mb-4">
                  <div class="alert-content">
                    <div class="alert-header">
                      <v-icon color="#f44336" size="20">mdi-alert-circle</v-icon>
                      <span class="alert-title">Access Denied</span>
                      <v-btn icon size="x-small" variant="text" @click="errorMessage = ''">
                        <v-icon size="16" color="#999">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <div class="alert-text">{{ errorMessage }}</div>
                  </div>
                </div>

                <!-- Success Message -->
                <div v-if="successMessage" class="alert-message success-message mb-4">
                  <v-icon color="#4CAF50" size="20" class="mr-2">mdi-check-circle</v-icon>
                  <span>{{ successMessage }}</span>
                </div>

                <v-btn 
                  :disabled="!valid || loading" 
                  color="#FF6B35" 
                  size="x-large"
                  block
                  type="submit"
                  :loading="loading"
                  class="login-btn"
                  elevation="0"
                >
                  <v-icon left class="mr-2">mdi-login</v-icon>
                  Sign In
                </v-btn>
              </v-form>
            </div>

            <!-- Footer -->
            <div class="form-footer">
              <span class="footer-text">Need assistance?</span>
              <a href="#" class="footer-link" @click.prevent="handleSupport">
                Contact Support
                <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
              </a>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { supabase } from '@/plugins/supabase'

export default {
  name: 'AdminLogin',
  data() {
    return {
      email: '',
      password: '',
      valid: false,
      loading: false,
      showPassword: false,
      errorMessage: '',
      successMessage: '',
      showContent: false,
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
      ],
      stats: [
        { number: '99.9%', label: 'Uptime' },
        { number: '256-bit', label: 'Encryption' },
        { number: '24/7', label: 'Support' }
      ],
      rules: {
        required: (value) => !!value || 'This field is required',
        email: (value) => /.+@.+\..+/.test(value) || 'Please enter a valid email address',
        minLength: (value) => (value && value.length >= 6) || 'Password must be at least 6 characters'
      }
    }
  },
  async mounted() {
    await this.checkExistingSession()
    setTimeout(() => {
      this.showContent = true
    }, 200)
  },
  methods: {
    async checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            const isAdmin = await this.checkSuperAdminStatus(user.id)
            if (isAdmin) {
              this.$router.push('/admin')
            } else {
              await supabase.auth.signOut()
            }
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
      }
    },

    async checkSuperAdminStatus(userId) {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('is_super_admin')
          .eq('id', userId)
          .single()

        if (error) {
          console.error('Profile check error:', error)
          return false
        }

        return profile?.is_super_admin === true
      } catch (error) {
        console.error('Super admin check error:', error)
        return false
      }
    },

    async login() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        console.log('Attempting login with:', this.email)
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: this.email,
          password: this.password
        })

        if (error) {
          console.error('Login error:', error)
          this.errorMessage = this.getErrorMessage(error.message)
          this.loading = false
          return
        }

        console.log('Login successful, checking admin privileges...')
        
        const isAdmin = await this.checkSuperAdminStatus(data.user.id)
        
        if (isAdmin) {
          this.successMessage = 'Super admin access granted! Redirecting...'
          
          setTimeout(() => {
            this.showContent = false
          }, 1000)
          
          setTimeout(() => {
            this.$router.push('/admin')
          }, 1500)
        } else {
          await supabase.auth.signOut()
          this.errorMessage = 'Access denied. Your account does not have super admin privileges.'
        }
      } catch (error) {
        console.error('Login catch error:', error)
        this.errorMessage = 'An unexpected error occurred. Please try again.'
      } finally {
        this.loading = false
      }
    },

    getErrorMessage(error) {
      switch (error) {
        case 'Invalid login credentials':
          return 'Invalid email or password. Please check your credentials.'
        case 'Email not confirmed':
          return 'Please confirm your email address before logging in.'
        case 'Too many requests':
          return 'Too many login attempts. Please wait a moment and try again.'
        default:
          return error
      }
    },
    
    handleSupport() {
      console.log('Contact support clicked')
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

/* Background */
.dashboard-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background: #0a0a0a;
  overflow: hidden;
}

.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 152, 0, 0.1) 0%, transparent 50%);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(255, 107, 53, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 107, 53, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  background: #FF6B35;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  background: #FF9800;
  top: 60%;
  right: 15%;
  animation-delay: 5s;
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: #FF6B35;
  bottom: 10%;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.login-wrapper {
  position: relative;
  z-index: 2;
  display: flex;
  min-height: 100vh;
}

/* LEFT SECTION */
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

.stats-container {
  display: flex;
  justify-content: space-around;
  gap: 30px;
  padding: 30px;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #FF6B35;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* RIGHT SECTION */
.right-section {
  flex: 0 0 550px;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  border-left: 1px solid rgba(255, 107, 53, 0.1);
}

.form-container {
  width: 100%;
  max-width: 450px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.header-icon-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(255, 107, 53, 0.15);
  border: 2px solid rgba(255, 107, 53, 0.3);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.2);
}

.form-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.form-subtitle {
  font-size: 15px;
  color: #999;
  margin: 0;
}

.login-card {
  margin-bottom: 24px;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
  font-size: 15px;
  background: rgba(20, 20, 20, 0.6);
  border-color: rgba(255, 255, 255, 0.1);
}

.custom-input :deep(.v-field--focused) {
  border-color: #FF6B35;
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
}

.custom-input :deep(.v-field__input) {
  color: #fff;
}

.custom-input :deep(.v-label) {
  color: #999;
}

.custom-input :deep(.v-field__prepend-inner .v-icon) {
  color: #666;
}

.custom-input :deep(.v-field__append-inner .v-icon) {
  color: #666;
}

.info-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 20px;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
}

.badge-text {
  font-size: 13px;
  font-weight: 600;
  color: #FF6B35;
}

.alert-message {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
}

.info-message {
  background: rgba(33, 150, 243, 0.1);
  border: 1px solid rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.error-message {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.error-message .alert-content {
  width: 100%;
}

.error-message .alert-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.error-message .alert-title {
  flex: 1;
  font-weight: 600;
  color: #f44336;
  font-size: 14px;
}

.error-message .alert-text {
  color: #ff8a80;
  font-size: 13px;
  line-height: 1.5;
}

.success-message {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.login-btn {
  text-transform: none !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  border-radius: 12px !important;
  padding: 28px 0 !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4) !important;
}

.form-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-text {
  color: #999;
  font-size: 14px;
  margin-right: 8px;
}

.footer-link {
  color: #FF6B35;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.footer-link:hover {
  color: #FF9800;
  gap: 4px;
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
  
  .left-section {
    flex: 0 0 auto;
    min-height: 50vh;
    padding: 40px 30px;
  }
  
  .right-section {
    flex: 0 0 auto;
    padding: 40px 30px;
    border-left: none;
    border-top: 1px solid rgba(255, 107, 53, 0.1);
  }
  
  .brand-title {
    font-size: 48px;
  }
  
  .brand-subtitle {
    font-size: 18px;
  }
  
  .feature-cards {
    margin-bottom: 30px;
  }
  
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

@media (max-width: 600px) {
  .left-section,
  .right-section {
    padding: 30px 20px;
  }
  
  .brand-title {
    font-size: 36px;
  }
  
  .brand-subtitle {
    font-size: 16px;
    margin-bottom: 40px;
  }
  
  .feature-card {
    padding: 18px;
  }
  
  .stats-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .form-title {
    font-size: 28px;
  }
}
</style>