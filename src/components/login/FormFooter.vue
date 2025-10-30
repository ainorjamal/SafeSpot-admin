<template>
  <div class="form-footer">
    <span class="footer-text">Need assistance?</span>
    <a href="#" class="footer-link" @click.prevent="handleSupport">
      Contact Support
      <v-icon size="16" class="ml-1">mdi-arrow-right</v-icon>
    </a>
  </div>
</template>

<script>
export default {
  name: 'FormFooter',
  methods: {
    handleSupport() {
      console.log('Contact support clicked')
      // Add your support contact logic here
    }
  }
}
</script>

<style scoped>
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
</style>