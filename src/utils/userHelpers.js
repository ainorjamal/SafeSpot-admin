export const getRoleBadgeClass = (role) => {
  const roleMap = {
    admin: 'role-admin',
    premium: 'role-premium',
    user: 'role-user'
  }
  return roleMap[role?.toLowerCase()] || 'role-user'
}

export const getRoleIcon = (role) => {
  const iconMap = {
    admin: 'mdi-shield-crown',
    premium: 'mdi-star',
    user: 'mdi-account'
  }
  return iconMap[role?.toLowerCase()] || 'mdi-account'
}

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const statusOptions = [
  { title: 'All Status', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' }
]

export const roleOptions = [
  { title: 'All Roles', value: 'all' },
  { title: 'User', value: 'user' },
  { title: 'Premium', value: 'premium' }
]

export const tableHeaders = [
  { title: 'Avatar', key: 'avatar_url', sortable: false, width: '80px' },
  { title: 'Name', key: 'full_name', sortable: true },
  { title: 'Mobile', key: 'mobile', sortable: false },
  { title: 'Role', key: 'role', sortable: true, width: '120px' },
  { title: 'Status', key: 'status', sortable: true, width: '120px' },
  { title: 'Joined', key: 'created_at', sortable: true, width: '180px' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '150px' }
]

export const breadcrumbs = [
  { title: 'Dashboard', disabled: false },
  { title: 'User Management', disabled: true }
]