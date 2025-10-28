<template>
  <v-app-bar 
    color="transparent" 
    elevation="0"
    app
    class="top-navbar"
  >
    <v-btn
      icon
      @click="$emit('update:rail', !rail)"
      class="menu-toggle"
      variant="text"
    >
      <v-icon color="#FF6B35">mdi-menu</v-icon>
    </v-btn>

    <v-toolbar-title class="page-title">
      <v-icon class="mr-2" color="#FF6B35" size="20">mdi-view-dashboard</v-icon>
      {{ currentPageTitle }}
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- User Menu -->
    <v-menu offset-y>
      <template v-slot:activator="{ props }">
        <div class="user-profile" v-bind="props">
          <div class="user-avatar">
            <v-icon color="#FF6B35" size="20">mdi-account</v-icon>
          </div>
          <div class="user-details">
            <span class="user-name">Super Admin</span>
            <span class="user-email-short">{{ userEmail }}</span>
          </div>
          <v-icon color="#999" size="20">mdi-chevron-down</v-icon>
        </div>
      </template>
      <v-list class="user-menu-dropdown">
        <v-list-item @click="() => {}">
          <template v-slot:prepend>
            <v-icon color="#FF6B35">mdi-account-circle</v-icon>
          </template>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="() => {}">
          <template v-slot:prepend>
            <v-icon color="#FF6B35">mdi-cog</v-icon>
          </template>
          <v-list-item-title>Settings</v-list-item-title>
        </v-list-item>
        <v-divider class="my-2"></v-divider>
        <v-list-item @click="$emit('logout')">
          <template v-slot:prepend>
            <v-icon color="#f44336">mdi-logout</v-icon>
          </template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  name: 'DashboardTopbar',
  props: {
    rail: Boolean,
    searchQuery: String,
    currentPageTitle: String,
    userEmail: String
  },
  emits: ['update:rail', 'update:searchQuery', 'logout']
}
</script>

<style scoped>
.top-navbar {
  backdrop-filter: blur(20px);
  background: rgba(15, 15, 15, 0.8) !important;
  border-bottom: 1px solid rgba(255, 107, 53, 0.1);
}

.menu-toggle {
  margin-right: 16px;
}

.page-title {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 16px;
}

.user-profile:hover {
  background: rgba(255, 107, 53, 0.15);
  border-color: rgba(255, 107, 53, 0.3);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(255, 107, 53, 0.2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 1;
}

.user-email-short {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu-dropdown {
  background: rgba(20, 20, 20, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 12px;
  margin-top: 8px;
}

@media (max-width: 960px) {
  .user-details {
    display: none;
  }
}
</style>