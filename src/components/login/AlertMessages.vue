<template>
  <div>
    <div v-if="loading && !errorMessage && !successMessage" class="alert-message info-message mb-4">
      <v-progress-circular indeterminate size="20" color="#FF6B35" class="mr-2"></v-progress-circular>
      <span>Verifying admin privileges...</span>
    </div>

    <div v-if="errorMessage" class="alert-message error-message mb-4">
      <div class="alert-content">
        <div class="alert-header">
          <v-icon color="#f44336" size="20">mdi-alert-circle</v-icon>
          <span class="alert-title">Access Denied</span>
          <v-btn icon size="x-small" variant="text" @click="$emit('close-error')">
            <v-icon size="16" color="#999">mdi-close</v-icon>
          </v-btn>
        </div>
        <div class="alert-text">{{ errorMessage }}</div>
      </div>
    </div>

    <div v-if="successMessage" class="alert-message success-message mb-4">
      <v-icon color="#4CAF50" size="20" class="mr-2">mdi-check-circle</v-icon>
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertMessages',
  props: {
    loading: Boolean,
    errorMessage: String,
    successMessage: String
  },
  emits: ['close-error']
}
</script>

<style scoped>
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
</style>