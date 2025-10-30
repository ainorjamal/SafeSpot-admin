<template>
  <div class="form-header">
    <div class="header-icon-wrapper">
      <v-icon size="48" color="#FF6B35">mdi-shield-lock</v-icon>
    </div>
    <h1 class="form-title">Welcome Back</h1>
    <p class="form-subtitle">Sign in to access the admin dashboard</p>
  </div>
</template>

<script>
export default {
  name: 'FormHeader'
}
</script>

<style scoped>
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

@media (max-width: 600px) {
  .form-title {
    font-size: 28px;
  }
}
</style>