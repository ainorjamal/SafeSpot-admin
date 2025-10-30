<template>
  <div class="stats-container">
    <div class="stat-item" v-for="(stat, index) in stats" :key="index">
      <div class="stat-number">{{ stat.number }}</div>
      <div class="stat-label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatsContainer',
  data() {
    return {
      stats: [
        { number: '99.9%', label: 'Uptime' },
        { number: '256-bit', label: 'Encryption' },
        { number: '24/7', label: 'Support' }
      ]
    }
  }
}
</script>

<style scoped>
.stats-container {
  display: flex;
  justify-content: space-around;
  gap: 30px;
  padding: 30px;
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  border-radius: 16px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #FF6B35;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
}

@media (max-width: 600px) {
  .stats-container {
    flex-direction: column;
    gap: 20px;
  }
}
</style>