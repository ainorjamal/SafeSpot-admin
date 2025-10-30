<template>
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
            :model-value="search"
            @update:model-value="$emit('update:search', $event)"
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
            :model-value="filterStatus"
            @update:model-value="$emit('update:filterStatus', $event)"
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
            :model-value="filterRole"
            @update:model-value="$emit('update:filterRole', $event)"
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
            @click="$emit('clear-filters')"
            height="44"
          >
            Clear Filters
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterCard',
  props: {
    search: String,
    filterStatus: String,
    filterRole: String,
    statusOptions: Array,
    roleOptions: Array
  },
  emits: ['update:search', 'update:filterStatus', 'update:filterRole', 'clear-filters']
}
</script>