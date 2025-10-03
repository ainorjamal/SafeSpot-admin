<template>
  <v-app>
    <!-- Animated Background -->
    <div class="dashboard-background">
      <div class="background-image"></div>
      <div class="animated-overlay" :style="{ opacity: overlayOpacity }"></div>
    </div>

    <!-- App Bar with Glass Effect -->
    <v-app-bar 
      color="transparent" 
      dark 
      elevation="0"
      app
      class="glass-appbar"
    >
      <v-toolbar-title class="font-weight-bold">
        <v-icon class="mr-2 pulse-icon">mdi-shield-crown</v-icon>
        SafeSpot Admin Dashboard
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <!-- User Info -->
      <v-chip 
        color="transparent" 
        text-color="white"
        class="mr-4 glass-chip"
        variant="outlined"
      >
        <v-icon left small class="mr-2">mdi-shield-crown</v-icon>
        Super Admin: {{ userEmail }}
      </v-chip>
      
      <!-- Logout Button -->
      <v-btn 
        color="error" 
        variant="flat"
        @click="logout"
        :loading="loading"
        prepend-icon="mdi-logout"
        class="logout-btn"
      >
        Logout
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="main-content">
      <v-container fluid class="pa-6">
        <!-- Welcome Card with Animation -->
        <transition name="fade-slide-scale">
          <v-card 
            v-show="showContent"
            class="mb-6 glass-card welcome-card" 
            elevation="24"
          >
            <v-card-text class="py-8 px-6">
              <div class="text-center">
                <div class="avatar-container mb-4">
                  <v-avatar 
                    size="100" 
                    color="brown-darken-2"
                    class="avatar-glow"
                  >
                    <v-icon size="50" color="white">mdi-shield-crown</v-icon>
                  </v-avatar>
                </div>
                <h1 class="welcome-text mb-3">
                  Welcome, Super Admin
                </h1>
                <p class="subtitle-text mb-4">
                  Exclusive access to SafeSpot Admin Panel
                </p>
                
                <!-- Additional Logout Button in Welcome Card -->
                <v-btn 
                  color="error" 
                  size="large"
                  variant="flat"
                  @click="logout"
                  :loading="loading"
                  prepend-icon="mdi-logout"
                  class="action-btn"
                  elevation="8"
                >
                  Sign Out
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </transition>

        <!-- System Status with Staggered Animation -->
        <v-row class="mb-6">
          <v-col 
            v-for="(status, index) in systemStatus" 
            :key="index"
            cols="12" 
            sm="6" 
            md="3"
          >
            <transition name="fade-slide-up" :style="{ transitionDelay: `${index * 100}ms` }">
              <v-card 
                v-show="showContent"
                :color="status.color" 
                dark
                class="status-card glass-card"
                elevation="12"
              >
                <v-card-text class="text-center py-6">
                  <v-icon size="50" class="mb-3 status-icon">{{ status.icon }}</v-icon>
                  <div class="text-h6 font-weight-bold">{{ status.title }}</div>
                  <div class="text-body-1">{{ status.status }}</div>
                </v-card-text>
              </v-card>
            </transition>
          </v-col>
        </v-row>

        <!-- Quick Actions with Animation -->
        <transition name="fade-slide-scale">
          <v-card v-show="showContent" class="glass-card" elevation="24">
            <v-card-title class="pa-6 d-flex align-center">
              <v-icon class="mr-3" size="30">mdi-lightning-bolt</v-icon>
              <span class="text-h5 font-weight-bold">Admin Controls</span>
            </v-card-title>
            <v-card-text class="pa-6">
              <v-row>
                <v-col 
                  v-for="(action, index) in adminActions" 
                  :key="index"
                  cols="12" 
                  sm="6" 
                  md="4"
                >
                  <v-btn 
                    block 
                    size="x-large" 
                    :color="action.color"
                    class="action-control-btn mb-3"
                    :prepend-icon="action.icon"
                    elevation="8"
                    @click="action.action"
                    :loading="action.loading"
                  >
                    {{ action.label }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </transition>

        <!-- Logout Confirmation Dialog -->
        <v-dialog v-model="logoutDialog" max-width="450">
          <v-card class="dialog-card" elevation="24">
            <v-card-title class="text-h5 pa-6 d-flex align-center">
              <v-icon class="mr-3" color="warning" size="30">mdi-logout</v-icon>
              Confirm Logout
            </v-card-title>
            <v-card-text class="px-6 pb-2 text-body-1">
              Are you sure you want to sign out of the admin panel?
            </v-card-text>
            <v-card-actions class="pa-6 pt-4">
              <v-spacer></v-spacer>
              <v-btn 
                color="grey" 
                variant="flat"
                @click="logoutDialog = false"
                size="large"
                class="mr-2"
              >
                Cancel
              </v-btn>
              <v-btn 
                color="error" 
                variant="flat"
                @click="confirmLogout"
                :loading="loading"
                size="large"
                elevation="4"
              >
                Sign Out
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Success/Error Messages -->
        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          :timeout="3000"
          location="top"
          class="custom-snackbar"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-2">
              {{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
            </v-icon>
            {{ snackbarText }}
          </div>
          <template v-slot:actions>
            <v-btn
              variant="text"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { supabase } from '@/plugins/supabase'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      loading: false,
      userEmail: '',
      userProfile: null,
      logoutDialog: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'info',
      showContent: false,
      overlayOpacity: 0.5,
      systemStatus: [
        { title: 'System', status: 'Online', icon: 'mdi-check-circle', color: 'success' },
        { title: 'Database', status: 'Connected', icon: 'mdi-database', color: 'info' },
        { title: 'Security', status: 'Active', icon: 'mdi-shield-check', color: 'warning' },
        { title: 'Admin', status: 'Authorized', icon: 'mdi-account-check', color: 'brown-darken-2' }
      ],
      adminActions: [
        { label: 'Manage Users', icon: 'mdi-account-multiple', color: 'brown-darken-2', action: () => {}, loading: false },
        { label: 'Safety Map', icon: 'mdi-map', color: 'brown-darken-2', action: () => {}, loading: false },
        { label: 'Analytics', icon: 'mdi-chart-line', color: 'brown-darken-2', action: () => {}, loading: false },
        { label: 'Incident Reports', icon: 'mdi-alert-octagon', color: 'brown-darken-2', action: () => {}, loading: false },
        { label: 'Settings', icon: 'mdi-cog', color: 'brown-darken-2', action: () => {}, loading: false },
        { label: 'Sign Out', icon: 'mdi-logout', color: 'error', action: () => this.logout(), loading: false }
      ]
    }
  },
  async mounted() {
    await this.getUserInfo()
    this.setupAuthStateListener()
    
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

    async getUserInfo() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          this.userEmail = user.email
          
          // Get user profile with super admin status
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (error) {
            console.error('Profile fetch error:', error)
            this.showMessage('Error loading profile', 'error')
            return
          }

          this.userProfile = profile
          
          // Double-check super admin status
          if (!profile?.is_super_admin) {
            console.log('Non-super-admin user detected, signing out...')
            await supabase.auth.signOut()
            this.$router.push('/')
          }
        }
      } catch (error) {
        console.error('Error getting user info:', error)
        this.showMessage('Error loading user info', 'error')
      }
    },

    setupAuthStateListener() {
      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (event === 'SIGNED_OUT' || !session) {
          this.$router.push('/')
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Re-verify super admin status on sign in
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_super_admin')
            .eq('id', session.user.id)
            .single()

          if (!profile?.is_super_admin) {
            await supabase.auth.signOut()
            this.$router.push('/')
          }
        }
      })
    },

    logout() {
      this.logoutDialog = true
    },

    async confirmLogout() {
      this.loading = true
      this.logoutDialog = false
      
      try {
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          this.showMessage('Logout failed: ' + error.message, 'error')
        } else {
          this.showMessage('Successfully signed out', 'success')
          
          // Exit animation
          this.showContent = false
          
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
        }
      } catch (error) {
        console.error('Logout error:', error)
        this.showMessage('Logout failed: ' + error.message, 'error')
      } finally {
        this.loading = false
      }
    },

    showMessage(text, color = 'info') {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    }
  }
}
</script>

<style scoped>
/* Background */
.dashboard-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
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
  transition: opacity 0.5s ease;
}

.main-content {
  position: relative;
  z-index: 1;
}

/* Glass Effects */
.glass-appbar {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.1) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-card {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px !important;
}

.glass-chip {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
}

/* Welcome Card */
.welcome-card {
  overflow: hidden;
}

.avatar-container {
  display: inline-block;
}

.avatar-glow {
  animation: pulse-glow 2s ease-in-out infinite;
  box-shadow: 0 0 30px rgba(121, 85, 72, 0.5);
}

@keyframes pulse-glow {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 30px rgba(121, 85, 72, 0.5);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 40px rgba(121, 85, 72, 0.7);
  }
}

.welcome-text {
  font-size: 42px;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
  letter-spacing: -0.5px;
}

.subtitle-text {
  font-size: 18px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
}

/* Status Cards */
.status-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.status-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4) !important;
}

.status-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Buttons */
.logout-btn,
.action-btn {
  text-transform: none !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
}

.logout-btn:hover,
.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3) !important;
}

.action-control-btn {
  text-transform: none !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  border-radius: 12px !important;
  padding: 24px 0 !important;
  transition: all 0.3s ease !important;
}

.action-control-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3) !important;
}

/* Dialog */
.dialog-card {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95) !important;
  border-radius: 20px !important;
}

/* Pulse Icon */
.pulse-icon {
  animation: pulse-icon 2s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
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

.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.6s ease;
}

.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(40px);
}

.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Custom Snackbar */
.custom-snackbar {
  font-weight: 500;
}

/* Responsive */
@media (max-width: 960px) {
  .welcome-text {
    font-size: 32px;
  }
  
  .subtitle-text {
    font-size: 16px;
  }
}

@media (max-width: 600px) {
  .welcome-text {
    font-size: 28px;
  }
  
  .avatar-glow {
    width: 80px !important;
    height: 80px !important;
  }
}
</style>