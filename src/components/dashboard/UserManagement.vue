<template>
  <v-container fluid class="user-management-container">
    <!-- Breadcrumb Section -->
    <div class="breadcrumb-section mb-6">
      <v-breadcrumbs :items="breadcrumbs" class="custom-breadcrumb pa-0">
        <template v-slot:divider>
          <v-icon size="16" color="#666">mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </div>

    <!-- Header Section -->
    <div class="welcome-header mb-6">
      <div class="welcome-content">
        <div class="welcome-badge">
          <v-icon size="32" color="#FF6B35">mdi-account-multiple</v-icon>
        </div>
        <div class="welcome-text-content">
          <h1 class="welcome-title">User Management</h1>
          <p class="welcome-subtitle">Manage mobile app users and their permissions</p>
        </div>
      </div>
      <div class="welcome-actions">
        <v-btn
          class="action-button-outlined"
          prepend-icon="mdi-refresh"
          @click="refreshUsers"
          :loading="loading"
        >
          Refresh Users
        </v-btn>
        <v-btn
          class="action-button"
          prepend-icon="mdi-download"
          @click="exportUsers"
        >
          Export Data
        </v-btn>
      </div>
    </div>

    <!-- Statistics Cards -->
    <StatisticsCards 
      :stats="stats" 
      :active-percentage="activePercentage"
      :month-percentage="monthPercentage"
    />

    <!-- Filters Card -->
    <FilterCard
      v-model:search="search"
      v-model:filter-status="filterStatus"
      v-model:filter-role="filterRole"
      :status-options="statusOptions"
      :role-options="roleOptions"
      @clear-filters="clearFilters"
    />

    <!-- Users Table Card -->
    <div class="dashboard-card">
      <div class="card-header">
        <div class="card-title-group">
          <v-icon color="#FF6B35" class="mr-3">mdi-account-multiple</v-icon>
          <div>
            <div class="card-title">All Users</div>
            <div class="card-subtitle">{{ filteredUsers.length }} users found</div>
          </div>
        </div>
      </div>
      <div class="card-body pa-0">
        <v-data-table
          :headers="headers"
          :items="filteredUsers"
          :loading="loading"
          :items-per-page="10"
          :search="search"
          class="user-table"
          theme="dark"
        >
          <!-- Avatar Column -->
          <template v-slot:item.avatar_url="{ item }">
            <v-avatar size="40" class="my-2">
              <v-img
                v-if="item.avatar_url"
                :src="item.avatar_url"
                :alt="item.full_name"
              />
              <v-icon v-else color="#666">mdi-account-circle</v-icon>
            </v-avatar>
          </template>

          <!-- Name Column -->
          <template v-slot:item.full_name="{ item }">
            <div class="user-name-cell">
              <div class="user-name-primary">{{ item.full_name || 'N/A' }}</div>
              <div class="user-name-secondary">{{ item.email }}</div>
            </div>
          </template>

          <!-- Role Column -->
          <template v-slot:item.role="{ item }">
            <div class="role-badge" :class="getRoleBadgeClass(item.role)">
              <v-icon size="14" class="mr-1">{{ getRoleIcon(item.role) }}</v-icon>
              <span>{{ item.role || 'User' }}</span>
            </div>
          </template>

          <!-- Status Column -->
          <template v-slot:item.status="{ item }">
            <div class="status-badge" :class="item.status === 'active' ? 'status-active' : 'status-inactive'">
              <div class="status-dot"></div>
              <span>{{ item.status }}</span>
            </div>
          </template>

          <!-- Created At Column -->
          <template v-slot:item.created_at="{ item }">
            <div class="date-cell">
              <div class="date-primary">{{ formatDate(item.created_at) }}</div>
              <div class="date-secondary">{{ formatTime(item.created_at) }}</div>
            </div>
          </template>

          <!-- Actions Column -->
          <template v-slot:item.actions="{ item }">
            <div class="action-buttons">
              <v-btn
                icon
                size="small"
                variant="text"
                @click="viewUser(item)"
                class="action-btn"
              >
                <v-icon size="18" color="#2196F3">mdi-eye</v-icon>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="editUser(item)"
                class="action-btn"
              >
                <v-icon size="18" color="#FF6B35">mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                size="small"
                variant="text"
                @click="confirmDelete(item)"
                class="action-btn"
              >
                <v-icon size="18" color="#f44336">mdi-delete</v-icon>
              </v-btn>
            </div>
          </template>

          <!-- Loading State -->
          <template v-slot:loading>
            <div class="loading-state">
              <v-progress-circular
                indeterminate
                color="#FF6B35"
                size="64"
              />
              <p class="mt-4">Loading users...</p>
            </div>
          </template>

          <!-- No Data State -->
          <template v-slot:no-data>
            <div class="empty-state">
              <v-icon size="64" color="#666">mdi-account-off</v-icon>
              <p class="empty-state-title">No users found</p>
              <p class="empty-state-subtitle">Try adjusting your filters</p>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- User Details Dialog -->
    <UserDetailsDialog
      v-model="detailsDialog"
      :user="selectedUser"
      @edit-user="editUser"
    />

    <!-- Delete Confirmation Dialog -->
    <DeleteConfirmDialog
      v-model="deleteDialog"
      :user="selectedUser"
      :loading="deleting"
      @confirm-delete="handleDeleteUser"
    />

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      location="top right"
      class="custom-snackbar"
    >
      <div class="snackbar-content">
        <v-icon class="mr-2" size="20">
          {{ snackbarColor === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}
        </v-icon>
        {{ snackbarText }}
      </div>
      <template v-slot:actions>
        <v-btn variant="text" size="small" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useUserManagement } from '@/composables/useUserManagement'
import { 
  getRoleBadgeClass, 
  getRoleIcon, 
  formatDate, 
  formatTime,
  statusOptions,
  roleOptions,
  tableHeaders,
  breadcrumbs
} from '@/utils/userHelpers'
import StatisticsCards from '@/components/UserManagement/StatisticsCards.vue'
import FilterCard from '@/components/UserManagement/FilterCard.vue'
import UserDetailsDialog from '@/components/UserManagement/UserDetailsDialog.vue'
import DeleteConfirmDialog from '@/components/UserManagement/DeleteConfirmDialog.vue'

export default {
  name: 'UserManagement',
  components: {
    StatisticsCards,
    FilterCard,
    UserDetailsDialog,
    DeleteConfirmDialog
  },
  setup() {
    const {
      users,
      loading,
      deleting,
      search,
      filterStatus,
      filterRole,
      selectedUser,
      stats,
      activePercentage,
      monthPercentage,
      filteredUsers,
      fetchUsers,
      deleteUser,
      clearFilters
    } = useUserManagement()

    const detailsDialog = ref(false)
    const deleteDialog = ref(false)
    const snackbar = ref(false)
    const snackbarText = ref('')
    const snackbarColor = ref('success')

    const headers = tableHeaders

    const refreshUsers = async () => {
      const result = await fetchUsers()
      if (result.success) {
        showMessage('Users list refreshed', 'success')
      } else {
        showMessage('Error loading users: ' + result.error, 'error')
      }
    }

    const viewUser = (user) => {
      selectedUser.value = user
      detailsDialog.value = true
    }

    const editUser = (user) => {
      detailsDialog.value = false
      showMessage('Edit functionality coming soon', 'info')
    }

    const confirmDelete = (user) => {
      selectedUser.value = user
      deleteDialog.value = true
    }

    const handleDeleteUser = async () => {
      if (!selectedUser.value) return

      const result = await deleteUser(selectedUser.value.id)
      if (result.success) {
        showMessage('User deleted successfully', 'success')
        deleteDialog.value = false
      } else {
        showMessage('Error deleting user: ' + result.error, 'error')
      }
    }

    const exportUsers = () => {
      showMessage('Export functionality coming soon', 'info')
    }

    const showMessage = (text, color = 'success') => {
      snackbarText.value = text
      snackbarColor.value = color
      snackbar.value = true
    }

    onMounted(async () => {
      const result = await fetchUsers()
      if (!result.success) {
        showMessage('Error loading users: ' + result.error, 'error')
      }
    })

    return {
      users,
      loading,
      deleting,
      search,
      filterStatus,
      filterRole,
      statusOptions,
      roleOptions,
      headers,
      stats,
      activePercentage,
      monthPercentage,
      filteredUsers,
      detailsDialog,
      deleteDialog,
      selectedUser,
      snackbar,
      snackbarText,
      snackbarColor,
      breadcrumbs,
      refreshUsers,
      clearFilters,
      viewUser,
      editUser,
      confirmDelete,
      handleDeleteUser,
      exportUsers,
      getRoleBadgeClass,
      getRoleIcon,
      formatDate,
      formatTime
    }
  }
}
</script>

<style scoped>
.user-management-container {
  padding: 32px;
}

/* Search Field Custom */
.search-field-custom :deep(.v-field) {
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: #fff;
}

.search-field-custom :deep(.v-field__input) {
  color: #fff;
}

.search-field-custom :deep(.v-field__input)::placeholder {
  color: #666;
}

.search-field-custom :deep(.v-label) {
  color: #999;
}

/* User Table */
.user-table {
  background: transparent !important;
}

.user-table :deep(.v-data-table__thead) {
  background: rgba(255, 255, 255, 0.02);
}

.user-table :deep(.v-data-table__th) {
  background: transparent !important;
  color: #999 !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.user-table :deep(.v-data-table__td) {
  color: #fff !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
  padding: 16px !important;
}

.user-table :deep(.v-data-table__tr:hover) {
  background: rgba(255, 107, 53, 0.05) !important;
}

/* User Name Cell */
.user-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name-primary {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.user-name-secondary {
  font-size: 12px;
  color: #999;
}

/* Role Badge */
.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-admin {
  background: rgba(244, 67, 54, 0.15);
  color: #f44336;
}

.role-premium {
  background: rgba(255, 152, 0, 0.15);
  color: #FF9800;
}

.role-user {
  background: rgba(255, 107, 53, 0.15);
  color: #FF6B35;
}

/* Status Badge */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.status-active {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

.status-inactive {
  background: rgba(117, 117, 117, 0.15);
  color: #999;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Date Cell */
.date-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-primary {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
}

.date-secondary {
  font-size: 11px;
  color: #666;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #999;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-state-title {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-top: 16px;
}

.empty-state-subtitle {
  font-size: 14px;
  color: #666;
  margin-top: 8px;
}

/* Dialog Card */
.dialog-card {
  background: rgba(20, 20, 20, 0.98) !important;
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(20px);
}

.user-dialog-avatar {
  border: 3px solid rgba(255, 107, 53, 0.3);
}

/* Info List in Dialog */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 107, 53, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-item-content {
  flex: 1;
}

.info-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-transform: capitalize;
}

/* Responsive */
@media (max-width: 960px) {
  .user-management-container {
    padding: 24px;
  }
  
  .welcome-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
  }
  
  .welcome-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .action-button,
  .action-button-outlined {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .user-management-container {
    padding: 16px;
  }
  
  .user-table :deep(.v-data-table__td),
  .user-table :deep(.v-data-table__th) {
    padding: 12px 8px !important;
    font-size: 12px !important;
  }
  
  .user-name-primary {
    font-size: 13px;
  }
  
  .user-name-secondary {
    font-size: 11px;
  }
}
</style>
