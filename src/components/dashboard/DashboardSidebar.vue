<template>
  <v-navigation-drawer
    :model-value="drawer"
    @update:model-value="$emit('update:drawer', $event)"
    app
    permanent
    :rail="rail"
    class="modern-sidebar"
    color="transparent"
  >
    <div class="sidebar-header">
      <div class="logo-container" @click="$emit('update:rail', !rail)">
        <div class="logo-icon">
          <v-icon color="#FF6B35" size="32">mdi-shield-crown</v-icon>
        </div>
        <transition name="fade">
          <div v-show="!rail" class="logo-text">
            <span class="logo-title">SafeSpot</span>
            <span class="logo-subtitle">Admin Panel</span>
          </div>
        </transition>
      </div>
    </div>

    <v-divider class="sidebar-divider"></v-divider>

    <v-list density="compact" nav class="sidebar-menu">
      <v-list-item
        v-for="(item, i) in menuItems"
        :key="i"
        :value="item.value"
        :active="activeMenu === item.value"
        @click="$emit('update:activeMenu', item.value)"
        class="menu-item"
        rounded="xl"
      >
        <template v-slot:prepend>
          <v-icon :color="activeMenu === item.value ? '#FF6B35' : '#666'">
            {{ item.icon }}
          </v-icon>
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="sidebar-footer">
        <v-divider class="sidebar-divider mb-4"></v-divider>
        <v-list-item
          @click="$emit('logout')"
          class="menu-item logout-item"
          rounded="xl"
        >
          <template v-slot:prepend>
            <v-icon color="#f44336">mdi-logout</v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'DashboardSidebar',
  props: {
    drawer: Boolean,
    rail: Boolean,
    activeMenu: String,
    menuItems: Array
  },
  emits: ['update:drawer', 'update:rail', 'update:activeMenu', 'logout']
}
</script>

<style scoped>
.modern-sidebar {
  backdrop-filter: blur(20px);
  background: rgba(15, 15, 15, 0.95) !important;
  border-right: 1px solid rgba(255, 107, 53, 0.1);
  transition: all 0.3s ease;
}

.sidebar-header {
  padding: 24px 16px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo-container:hover {
  transform: translateX(4px);
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 107, 53, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
  line-height: 1;
}

.logo-subtitle {
  font-size: 11px;
  font-weight: 500;
  color: #999;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 4px;
}

.sidebar-divider {
  border-color: rgba(255, 107, 53, 0.1) !important;
  margin: 0 16px;
}

.sidebar-menu {
  padding: 16px 12px;
}

.menu-item {
  margin-bottom: 8px;
  color: #999 !important;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background: rgba(255, 107, 53, 0.1) !important;
  color: #FF6B35 !important;
}

.menu-item.v-list-item--active {
  background: rgba(255, 107, 53, 0.15) !important;
  color: #FF6B35 !important;
  border-left: 3px solid #FF6B35;
}

.sidebar-footer {
  padding: 16px 12px;
}

.logout-item {
  color: #f44336 !important;
}

.logout-item:hover {
  background: rgba(244, 67, 54, 0.1) !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>