<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="400" class="modern-dialog">
    <v-card class="dialog-card">
      <div class="dialog-content">
        <div class="dialog-header">
          <div class="dialog-icon-wrapper">
            <v-icon size="40" color="#f44336">mdi-alert-circle</v-icon>
          </div>
          <div class="dialog-title">Confirm Delete</div>
          <div class="dialog-subtitle">
            Are you sure you want to delete user <strong>{{ user?.full_name }}</strong>? 
            This action cannot be undone.
          </div>
        </div>
        <div class="dialog-actions">
          <v-btn
            class="cancel-btn"
            variant="outlined"
            @click="$emit('update:modelValue', false)"
          >
            Cancel
          </v-btn>
          <v-btn
            class="confirm-btn"
            color="#f44336"
            @click="$emit('confirm-delete')"
            :loading="loading"
          >
            Delete User
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'DeleteConfirmDialog',
  props: {
    modelValue: Boolean,
    user: Object,
    loading: Boolean
  },
  emits: ['update:modelValue', 'confirm-delete']
}
</script>

