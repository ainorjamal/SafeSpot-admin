<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600" class="modern-dialog">
    <v-card v-if="user" class="dialog-card">
      <div class="dialog-content">
        <div class="dialog-header">
          <v-avatar size="100" class="user-dialog-avatar">
            <v-img
              v-if="user.avatar_url"
              :src="user.avatar_url"
              :alt="user.full_name"
            />
            <v-icon v-else size="60" color="#666">mdi-account-circle</v-icon>
          </v-avatar>
          <div class="dialog-title mt-4">{{ user.full_name || 'N/A' }}</div>
          <div class="dialog-subtitle">{{ user.email }}</div>
        </div>
        
        <div class="info-list">
          <div class="info-item">
            <div class="info-item-icon">
              <v-icon size="20" color="#FF6B35">mdi-phone</v-icon>
            </div>
            <div class="info-item-content">
              <div class="info-label">Mobile Number</div>
              <div class="info-value">{{ user.mobile || 'N/A' }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item-icon">
              <v-icon size="20" color="#FF6B35">mdi-shield-account</v-icon>
            </div>
            <div class="info-item-content">
              <div class="info-label">User Role</div>
              <div class="info-value">{{ user.role || 'User' }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item-icon">
              <v-icon size="20" color="#FF6B35">mdi-calendar</v-icon>
            </div>
            <div class="info-item-content">
              <div class="info-label">Joined Date</div>
              <div class="info-value">{{ formatDate(user.created_at) }}</div>
            </div>
          </div>

          <div class="info-item">
            <div class="info-item-icon">
              <v-icon size="20" color="#FF6B35">mdi-circle</v-icon>
            </div>
            <div class="info-item-content">
              <div class="info-label">Account Status</div>
              <div class="info-value">{{ user.status }}</div>
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <v-btn
            class="cancel-btn"
            variant="outlined"
            @click="$emit('update:modelValue', false)"
          >
            Close
          </v-btn>
          <v-btn
            class="action-button"
            prepend-icon="mdi-pencil"
            @click="$emit('edit-user', user)"
          >
            Edit User
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatDate } from '@/utils/userHelpers'

export default {
  name: 'UserDetailsDialog',
  props: {
    modelValue: Boolean,
    user: Object
  },
  emits: ['update:modelValue', 'edit-user'],
  setup() {
    return { formatDate }
  }
}
</script>