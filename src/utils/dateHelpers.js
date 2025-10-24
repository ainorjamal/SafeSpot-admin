// utils/dateHelpers.js

/**
 * Get human-readable time difference from a timestamp
 * @param {string|Date} timestamp - The timestamp to compare
 * @returns {string} Human-readable time difference
 */
export function getTimeDifference(timestamp) {
  const now = new Date()
  const past = new Date(timestamp)
  const diffInMs = now - past
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
}

/**
 * Format date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'time')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'long') {
  const d = new Date(date)
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }
  
  if (format === 'time') {
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
  
  return d.toLocaleString('en-US')
}

/**
 * Check if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export function isToday(date) {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

/**
 * Check if a date is within the last N days
 * @param {string|Date} date - The date to check
 * @param {number} days - Number of days to check
 * @returns {boolean} True if the date is within the last N days
 */
export function isWithinLastDays(date, days) {
  const d = new Date(date)
  const daysAgo = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  return d > daysAgo
}

/**
 * Get start of today
 * @returns {Date} Start of today (00:00:00)
 */
export function getStartOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

/**
 * Get end of today
 * @returns {Date} End of today (23:59:59)
 */
export function getEndOfToday() {
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  return today
}

/**
 * Get date N days ago
 * @param {number} days - Number of days
 * @returns {Date} Date N days ago
 */
export function getDaysAgo(days) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}