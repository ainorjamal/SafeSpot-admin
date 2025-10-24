// composables/useDashboardData.js
import { ref, computed } from 'vue'

export function useDashboardData() {
  const drawer = ref(true)
  const rail = ref(false)
  const searchQuery = ref('')
  const activeMenu = ref('dashboard')
  const showContent = ref(false)

  const menuItems = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', value: 'dashboard' },
    { title: 'User Management', icon: 'mdi-account-multiple', value: 'users' },
    { title: 'Safety Map', icon: 'mdi-map-marker', value: 'map' },
    { title: 'Analytics', icon: 'mdi-chart-line', value: 'analytics' },
    { title: 'Reports', icon: 'mdi-file-chart', value: 'reports' },
    { title: 'Settings', icon: 'mdi-cog', value: 'settings' }
  ]

  const breadcrumbs = [
    { title: 'Admin', disabled: false },
    { title: 'Dashboard', disabled: true }
  ]

  const currentPageTitle = computed(() => {
    const active = menuItems.find(item => item.value === activeMenu.value)
    return active ? active.title : 'Dashboard'
  })

  return {
    drawer,
    rail,
    searchQuery,
    activeMenu,
    showContent,
    menuItems,
    breadcrumbs,
    currentPageTitle
  }
}