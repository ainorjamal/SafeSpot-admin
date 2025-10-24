<template>
  <v-dialog 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="400"
  >
    <v-card class="modern-dialog">
      <v-card-text class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon-wrapper">
            <v-icon color="#FF6B35" size="32">mdi-logout-variant</v-icon>
          </div>
          <h3 class="dialog-title">Confirm Logout</h3>
          <p class="dialog-subtitle">Are you sure you want to sign out of the admin panel?</p>
        </div>
        <div class="dialog-actions">
          <v-btn 
            variant="tonal"
            @click="$emit('update:modelValue', false)"
            class="cancel-btn"
            :width="150"
            color="grey-darken-3"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="#FF6B35"
            variant="flat"
            @click="$emit('confirm')"
            :loading="loading"
            class="confirm-btn"
            :width="150"
          >
            Sign Out
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LogoutDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'confirm']
}
</script>

<style scoped>
/* Styles are imported from dashboard.css */
</style>