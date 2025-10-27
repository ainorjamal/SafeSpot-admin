// composables/useDashboardData.js
import { ref, computed, watch } from 'vue'

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

  const breadcrumbs = computed(() => {
    const breadcrumbMap = {
      dashboard: [
        { title: 'Home', disabled: false },
        { title: 'Dashboard', disabled: true }
      ],
      users: [
        { title: 'Dashboard', disabled: false },
        { title: 'User Management', disabled: true }
      ],
      map: [
        { title: 'Dashboard', disabled: false },
        { title: 'Safety Map', disabled: true }
      ],
      analytics: [
        { title: 'Dashboard', disabled: false },
        { title: 'Analytics', disabled: true }
      ],
      reports: [
        { title: 'Dashboard', disabled: false },
        { title: 'Reports', disabled: true }
      ],
      settings: [
        { title: 'Dashboard', disabled: false },
        { title: 'Settings', disabled: true }
      ]
    }
    return breadcrumbMap[activeMenu.value] || breadcrumbMap.dashboard
  })

  const currentPageTitle = computed(() => {
    const pageTitleMap = {
      dashboard: 'Dashboard',
      users: 'User Management',
      map: 'Safety Map',
      analytics: 'Analytics',
      reports: 'Reports',
      settings: 'Settings'
    }
    return pageTitleMap[activeMenu.value] || 'Dashboard'
  })

  // Watch for menu changes and update page title
  watch(activeMenu, (newMenu) => {
    console.log('Active menu changed to:', newMenu)
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