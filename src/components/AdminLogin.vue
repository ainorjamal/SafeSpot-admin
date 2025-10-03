<template>
  <div class="login-container">
    <!-- Background Image with Overlay -->
    <div class="background-image"></div>
    <div class="animated-overlay" :style="{ opacity: overlayOpacity }"></div>
    
    <v-container class="d-flex align-center justify-center fill-height">
      <div class="login-content">
        <!-- Animated Header -->
        <transition name="fade-slide-scale">
          <div v-show="showContent" class="header-section">
            <div class="logo-container">
              <v-icon size="80" color="white" class="logo-icon">mdi-shield-crown</v-icon>
            </div>
            <h1 class="welcome-title">Welcome Back</h1>
            <p class="welcome-subtitle">SafeSpot Admin Panel</p>
          </div>
        </transition>

        <!-- Animated Form Card -->
        <transition name="fade-slide-scale" mode="out-in">
          <v-card 
            v-show="showContent" 
            class="login-card glass-effect"
            elevation="24"
          >
            <v-card-text class="pa-8">
              <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="login">
                <v-text-field
                  v-model="email"
                  label="Admin Email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  class="mb-4 custom-input"
                  color="brown-darken-2"
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
                  color="brown-darken-2"
                  required
                  :disabled="loading"
                ></v-text-field>

                <!-- Admin Info Badge -->
                <v-card 
                  variant="tonal" 
                  color="brown-lighten-5" 
                  class="mb-4 info-badge"
                >
                  <v-card-text class="text-center py-2">
                    <v-icon size="20" class="mr-1">mdi-information</v-icon>
                    <span class="text-caption">Super Admin Access Required</span>
                  </v-card-text>
                </v-card>

                <!-- Loading Message -->
                <v-alert
                  v-if="loading && !errorMessage && !successMessage"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  <div class="d-flex align-center">
                    <v-progress-circular indeterminate size="20" class="mr-2"></v-progress-circular>
                    Verifying admin privileges...
                  </div>
                </v-alert>

                <!-- Error Message -->
                <v-alert
                  v-if="errorMessage"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  closable
                  @click:close="errorMessage = ''"
                >
                  <template v-slot:prepend>
                    <v-icon>mdi-alert-circle</v-icon>
                  </template>
                  <div class="font-weight-bold">Access Denied</div>
                  {{ errorMessage }}
                </v-alert>

                <!-- Success Message -->
                <v-alert
                  v-if="successMessage"
                  type="success"
                  variant="tonal"
                  class="mb-4"
                >
                  <template v-slot:prepend>
                    <v-icon>mdi-check-circle</v-icon>
                  </template>
                  {{ successMessage }}
                </v-alert>

                <v-btn 
                  :disabled="!valid || loading" 
                  color="brown-darken-2" 
                  size="x-large"
                  block
                  type="submit"
                  :loading="loading"
                  class="login-btn"
                  elevation="8"
                >
                  <v-icon left class="mr-2">mdi-login</v-icon>
                  Admin Login
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </transition>

        <!-- Animated Footer Text -->
        <transition name="fade-slide">
          <div v-show="showContent" class="footer-section">
            <div class="signup-container glass-effect-light">
              <span class="signup-text">Need assistance?</span>
              <a href="#" class="signup-link" @click.prevent="handleSupport">
                Contact Support
              </a>
            </div>
          </div>
        </transition>
      </div>
    </v-container>
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
      overlayOpacity: 0.5,
      rules: {
        required: (value) => !!value || 'This field is required',
        email: (value) => /.+@.+\..+/.test(value) || 'Please enter a valid email address',
        minLength: (value) => (value && value.length >= 6) || 'Password must be at least 6 characters'
      }
    }
  },
  async mounted() {
    // Check if user is already logged in
    await this.checkExistingSession()

    // Start entrance animations
    setTimeout(() => {
      this.showContent = true
    }, 200)

    // Animate background overlay
    this.animateOverlay()
  },
  methods: {
    animateOverlay() {
      setInterval(() => {
        this.overlayOpacity = 0.5 + Math.sin(Date.now() / 3000) * 0.1
      }, 50)
    },
    
    async checkExistingSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data: { user } } = await supabase.auth.getUser()
          
          if (user) {
            // Check if current user is super admin
            const isAdmin = await this.checkSuperAdminStatus(user.id)
            if (isAdmin) {
              this.$router.push('/admin')
            } else {
              // Sign out non-admin user
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
        
        // Check if user is super admin
        const isAdmin = await this.checkSuperAdminStatus(data.user.id)
        
        if (isAdmin) {
          this.successMessage = 'Super admin access granted! Redirecting...'
          
          // Exit animation
          setTimeout(() => {
            this.showContent = false
          }, 1000)
          
          // Navigate after animation
          setTimeout(() => {
            this.$router.push('/admin')
          }, 1500)
        } else {
          // Sign out non-admin user immediately
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
      // Implement support contact functionality
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

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/assets/bg2_icon.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.animated-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.7)
  );
  z-index: 1;
  transition: opacity 0.5s ease;
}

.v-container {
  position: relative;
  z-index: 2;
}

.login-content {
  width: 100%;
  max-width: 450px;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo-container {
  margin-bottom: 20px;
}

.logo-icon {
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: -1px;
}

.welcome-subtitle {
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

.login-card {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px !important;
  overflow: hidden;
}

.glass-effect {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
}

.custom-input :deep(.v-field) {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
}

.custom-input :deep(.v-field--focused) {
  background: white;
}

.info-badge {
  backdrop-filter: blur(10px);
  border-radius: 12px !important;
}

.login-btn {
  text-transform: none !important;
  font-size: 18px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  border-radius: 12px !important;
  padding: 28px 0 !important;
  background: linear-gradient(135deg, #795548 0%, #5d4037 100%) !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3) !important;
}

.footer-section {
  margin-top: 30px;
  text-align: center;
}

.signup-container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
}

.glass-effect-light {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.signup-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 400;
}

.signup-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: 700;
  padding: 4px 12px;
  background: linear-gradient(135deg, #8d6e63 0%, #6d4c41 100%);
  border-radius: 8px;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.signup-link:hover {
  transform: translateY(-1px);
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.4);
}

/* Animations */
.fade-slide-scale-enter-active,
.fade-slide-scale-leave-active {
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.fade-slide-scale-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.8);
}

.fade-slide-scale-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.6s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive */
@media (max-width: 600px) {
  .welcome-title {
    font-size: 36px;
  }
  
  .welcome-subtitle {
    font-size: 18px;
  }
  
  .login-card {
    margin: 0 16px;
  }
}
</style>