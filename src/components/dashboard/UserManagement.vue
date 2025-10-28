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
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-primary">
              <v-icon size="28" color="#FF6B35">mdi-account-group</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.total }}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend up">
              <v-icon size="14">mdi-trending-up</v-icon>
              <span>All Time</span>
            </div>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" style="width: 100%"></div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-success">
              <v-icon size="28" color="#4CAF50">mdi-account-check</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.active }}</div>
            <div class="stat-label">Active Users</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend up">
              <v-icon size="14">mdi-trending-up</v-icon>
              <span>{{ activePercentage }}%</span>
            </div>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" :style="`width: ${activePercentage}%`"></div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-warning">
              <v-icon size="28" color="#FF9800">mdi-account-plus</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.newToday }}</div>
            <div class="stat-label">New Today</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend neutral">
              <v-icon size="14">mdi-calendar-today</v-icon>
              <span>Today</span>
            </div>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" style="width: 45%"></div>
          </div>
        </div>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <div class="stat-card">
          <div class="stat-header">
            <div class="stat-icon-box icon-neutral">
              <v-icon size="28" color="#999">mdi-calendar-month</v-icon>
            </div>
          </div>
          <div class="stat-body">
            <div class="stat-value">{{ stats.thisMonth }}</div>
            <div class="stat-label">This Month</div>
          </div>
          <div class="stat-footer">
            <div class="stat-trend up">
              <v-icon size="14">mdi-trending-up</v-icon>
              <span>{{ monthPercentage }}%</span>
            </div>
          </div>
          <div class="stat-progress">
            <div class="progress-bar" :style="`width: ${monthPercentage}%`"></div>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Filters Card -->
    <div class="dashboard-card mb-6">
      <div class="card-header">
        <div class="card-title-group">
          <v-icon color="#FF6B35" class="mr-3">mdi-filter-variant</v-icon>
          <div>
            <div class="card-title">Filter Users</div>
            <div class="card-subtitle">Refine your search results</div>
          </div>
        </div>
      </div>
      <div class="card-body">
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="Search users..."
              variant="solo"
              density="comfortable"
              clearable
              hide-details
              class="search-field-custom"
              bg-color="rgba(255, 255, 255, 0.02)"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              label="Status"
              variant="solo"
              density="comfortable"
              hide-details
              class="search-field-custom"
              bg-color="rgba(255, 255, 255, 0.02)"
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filterRole"
              :items="roleOptions"
              label="Role"
              variant="solo"
              density="comfortable"
              hide-details
              class="search-field-custom"
              bg-color="rgba(255, 255, 255, 0.02)"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn
              block
              class="action-button-outlined"
              @click="clearFilters"
              height="44"
            >
              Clear Filters
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </div>

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
    <v-dialog v-model="detailsDialog" max-width="600" class="modern-dialog">
      <v-card v-if="selectedUser" class="dialog-card">
        <div class="dialog-content">
          <div class="dialog-header">
            <v-avatar size="100" class="user-dialog-avatar">
              <v-img
                v-if="selectedUser.avatar_url"
                :src="selectedUser.avatar_url"
                :alt="selectedUser.full_name"
              />
              <v-icon v-else size="60" color="#666">mdi-account-circle</v-icon>
            </v-avatar>
            <div class="dialog-title mt-4">{{ selectedUser.full_name || 'N/A' }}</div>
            <div class="dialog-subtitle">{{ selectedUser.email }}</div>
          </div>
          
          <div class="info-list">
            <div class="info-item">
              <div class="info-item-icon">
                <v-icon size="20" color="#FF6B35">mdi-phone</v-icon>
              </div>
              <div class="info-item-content">
                <div class="info-label">Mobile Number</div>
                <div class="info-value">{{ selectedUser.mobile || 'N/A' }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-item-icon">
                <v-icon size="20" color="#FF6B35">mdi-shield-account</v-icon>
              </div>
              <div class="info-item-content">
                <div class="info-label">User Role</div>
                <div class="info-value">{{ selectedUser.role || 'User' }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-item-icon">
                <v-icon size="20" color="#FF6B35">mdi-calendar</v-icon>
              </div>
              <div class="info-item-content">
                <div class="info-label">Joined Date</div>
                <div class="info-value">{{ formatDate(selectedUser.created_at) }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-item-icon">
                <v-icon size="20" color="#FF6B35">mdi-circle</v-icon>
              </div>
              <div class="info-item-content">
                <div class="info-label">Account Status</div>
                <div class="info-value">{{ selectedUser.status }}</div>
              </div>
            </div>
          </div>

          <div class="dialog-actions">
            <v-btn
              class="cancel-btn"
              variant="outlined"
              @click="detailsDialog = false"
            >
              Close
            </v-btn>
            <v-btn
              class="action-button"
              prepend-icon="mdi-pencil"
              @click="editUser(selectedUser)"
            >
              Edit User
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" class="modern-dialog">
      <v-card class="dialog-card">
        <div class="dialog-content">
          <div class="dialog-header">
            <div class="dialog-icon-wrapper">
              <v-icon size="40" color="#f44336">mdi-alert-circle</v-icon>
            </div>
            <div class="dialog-title">Confirm Delete</div>
            <div class="dialog-subtitle">
              Are you sure you want to delete user <strong>{{ selectedUser?.full_name }}</strong>? 
              This action cannot be undone.
            </div>
          </div>
          <div class="dialog-actions">
            <v-btn
              class="cancel-btn"
              variant="outlined"
              @click="deleteDialog = false"
            >
              Cancel
            </v-btn>
            <v-btn
              class="confirm-btn"
              color="#f44336"
              @click="deleteUser"
              :loading="deleting"
            >
              Delete User
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>

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
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/plugins/supabase'

export default {
  name: 'UserManagement',
  setup() {
    const users = ref([])
    const loading = ref(false)
    const deleting = ref(false)
    const search = ref('')
    const filterStatus = ref('all')
    const filterRole = ref('all')
    const detailsDialog = ref(false)
    const deleteDialog = ref(false)
    const selectedUser = ref(null)
    const snackbar = ref(false)
    const snackbarText = ref('')
    const snackbarColor = ref('success')

    const breadcrumbs = [
      { title: 'Dashboard', disabled: false },
      { title: 'User Management', disabled: true }
    ]

    const statusOptions = [
      { title: 'All Status', value: 'all' },
      { title: 'Active', value: 'active' },
      { title: 'Inactive', value: 'inactive' }
    ]

    const roleOptions = [
      { title: 'All Roles', value: 'all' },
      { title: 'User', value: 'user' },
      { title: 'Premium', value: 'premium' }
    ]

    const headers = [
      { title: 'Avatar', key: 'avatar_url', sortable: false, width: '80px' },
      { title: 'Name', key: 'full_name', sortable: true },
      { title: 'Mobile', key: 'mobile', sortable: false },
      { title: 'Role', key: 'role', sortable: true, width: '120px' },
      { title: 'Status', key: 'status', sortable: true, width: '120px' },
      { title: 'Joined', key: 'created_at', sortable: true, width: '180px' },
      { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '150px' }
    ]

    const stats = computed(() => {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      return {
        total: users.value.length,
        active: users.value.filter(u => u.status === 'active').length,
        newToday: users.value.filter(u => new Date(u.created_at) >= today).length,
        thisMonth: users.value.filter(u => new Date(u.created_at) >= thisMonth).length
      }
    })

    const activePercentage = computed(() => {
      if (stats.value.total === 0) return 0
      return Math.round((stats.value.active / stats.value.total) * 100)
    })

    const monthPercentage = computed(() => {
      if (stats.value.total === 0) return 0
      return Math.round((stats.value.thisMonth / stats.value.total) * 100)
    })

    const filteredUsers = computed(() => {
      let filtered = users.value

      if (filterStatus.value !== 'all') {
        filtered = filtered.filter(u => u.status === filterStatus.value)
      }

      if (filterRole.value !== 'all') {
        filtered = filtered.filter(u => (u.role || 'user') === filterRole.value)
      }

      return filtered
    })

    const fetchUsers = async () => {
      loading.value = true
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .or('is_super_admin.is.null,is_super_admin.eq.false')
          .order('created_at', { ascending: false })

        if (error) throw error

        users.value = data.map(user => ({
          ...user,
          status: getStatusFromDate(user.created_at),
          role: user.role || 'user'
        }))

        console.log('Fetched users:', users.value.length)
      } catch (error) {
        console.error('Error fetching users:', error)
        showMessage('Error loading users: ' + error.message, 'error')
      } finally {
        loading.value = false
      }
    }

    const getStatusFromDate = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24)
      return daysDiff < 30 ? 'active' : 'inactive'
    }

    const refreshUsers = () => {
      fetchUsers()
      showMessage('Users list refreshed', 'success')
    }

    const clearFilters = () => {
      search.value = ''
      filterStatus.value = 'all'
      filterRole.value = 'all'
    }

    const viewUser = (user) => {
      selectedUser.value = user
      detailsDialog.value = true
    }

    const editUser = (user) => {
      showMessage('Edit functionality coming soon', 'info')
    }

    const confirmDelete = (user) => {
      selectedUser.value = user
      deleteDialog.value = true
    }

    const deleteUser = async () => {
      if (!selectedUser.value) return

      deleting.value = true
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', selectedUser.value.id)

        if (error) throw error

        users.value = users.value.filter(u => u.id !== selectedUser.value.id)
        showMessage('User deleted successfully', 'success')
        deleteDialog.value = false
      } catch (error) {
        console.error('Error deleting user:', error)
        showMessage('Error deleting user: ' + error.message, 'error')
      } finally {
        deleting.value = false
      }
    }

    const exportUsers = () => {
      showMessage('Export functionality coming soon', 'info')
    }

    const getRoleBadgeClass = (role) => {
      const roleMap = {
        admin: 'role-admin',
        premium: 'role-premium',
        user: 'role-user'
      }
      return roleMap[role?.toLowerCase()] || 'role-user'
    }

    const getRoleIcon = (role) => {
      const iconMap = {
        admin: 'mdi-shield-crown',
        premium: 'mdi-star',
        user: 'mdi-account'
      }
      return iconMap[role?.toLowerCase()] || 'mdi-account'
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const formatTime = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const showMessage = (text, color = 'success') => {
      snackbarText.value = text
      snackbarColor.value = color
      snackbar.value = true
    }

    onMounted(() => {
      fetchUsers()
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
      deleteUser,
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