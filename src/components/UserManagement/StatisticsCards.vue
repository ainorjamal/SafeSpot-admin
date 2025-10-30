<template>
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
</template>

<script>
export default {
  name: 'StatisticsCards',
  props: {
    stats: {
      type: Object,
      required: true
    },
    activePercentage: {
      type: Number,
      required: true
    },
    monthPercentage: {
      type: Number,
      required: true
    }
  }
}
</script>
