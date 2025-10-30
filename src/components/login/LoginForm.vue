<template>
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

    <div class="info-badge mb-4">
      <v-icon size="20" class="mr-2" color="#FF6B35">mdi-shield-star</v-icon>
      <span class="badge-text">Super Admin Access Required</span>
    </div>

    <AlertMessages 
      :loading="loading"
      :error-message="errorMessage"
      :success-message="successMessage"
      @close-error="errorMessage = ''"
    />

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
</template>

<script>
import { supabase } from '@/plugins/supabase'
import AlertMessages from './AlertMessages.vue'

export default {
  name: 'LoginForm',
  components: {
    AlertMessages
  },
  emits: ['login-success'],
  data() {
    return {
      email: '',
      password: '',
      valid: false,
      loading: false,
      showPassword: false,
      errorMessage: '',
      successMessage: '',
      rules: {
        required: (value) => !!value || 'This field is required',
        email: (value) => /.+@.+\..+/.test(value) || 'Please enter a valid email address',
        minLength: (value) => (value && value.length >= 6) || 'Password must be at least 6 characters'
      }
    }
  },
  async mounted() {
    await this.checkExistingSession()
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
          this.$emit('login-success')
          
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
    }
  }
}
</script>

<style scoped>
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
</style>