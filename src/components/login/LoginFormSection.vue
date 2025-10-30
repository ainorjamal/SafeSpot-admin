<template>
  <div class="right-section">
    <div class="form-container">
      <FormHeader />
      
      <div class="login-card">
        <LoginForm 
          @login-success="$emit('login-success')"
        />
      </div>

      <FormFooter />
    </div>
  </div>
</template>

<script>
import FormHeader from './FormHeader.vue'
import LoginForm from './LoginForm.vue'
import FormFooter from './FormFooter.vue'

export default {
  name: 'LoginFormSection',
  components: {
    FormHeader,
    LoginForm,
    FormFooter
  },
  emits: ['login-success']
}
</script>

<style scoped>
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

.login-card {
  margin-bottom: 24px;
}

@media (max-width: 1200px) {
  .right-section {
    flex: 0 0 auto;
    padding: 40px 30px;
    border-left: none;
    border-top: 1px solid rgba(255, 107, 53, 0.1);
  }
}

@media (max-width: 600px) {
  .right-section {
    padding: 30px 20px;
  }
}
</style>