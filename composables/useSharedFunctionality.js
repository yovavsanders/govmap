/**
 * Shared Composable for Vue 3 Composition API
 * 
 * This composable provides the same functionality as the Options API mixin
 * but designed for use with Vue 3's Composition API.
 * 
 * Features:
 * - Reactive computed property: currentTimestamp
 * - Utility methods: formatNumber, validateEmail
 * - Lifecycle integration: onMounted hook
 * - State management: counter functionality
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

/**
 * Main composable function that provides shared functionality
 * @param {Object} options - Configuration options
 * @param {boolean} options.enableTimestampUpdates - Whether to auto-update timestamp
 * @param {string} options.componentName - Name for logging purposes
 * @returns {Object} Reactive state and methods
 */
export function useSharedFunctionality(options = {}) {
  const {
    enableTimestampUpdates = true,
    componentName = 'Unknown Component'
  } = options;

  // Reactive state
  const mixinCounter = ref(0);
  const lastUpdated = ref(null);
  let timestampInterval = null;

  // Shared constants
  const SHARED_CONSTANTS = Object.freeze({
    MAX_COUNTER: 1000,
    MIN_COUNTER: 0,
    DEFAULT_LOCALE: 'en-US',
    TIMESTAMP_FORMAT: 'YYYY-MM-DD HH:mm:ss'
  });

  /**
   * Computed property that returns formatted current timestamp
   */
  const currentTimestamp = computed(() => {
    // Trigger reactivity by accessing lastUpdated
    lastUpdated.value;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
  });

  /**
   * Computed property that returns counter with formatted display
   */
  const formattedCounter = computed(() => {
    return `Counter: ${formatNumber(mixinCounter.value)}`;
  });

  /**
   * Shared method to format numbers with proper localization
   * @param {number} number - The number to format
   * @param {object} options - Formatting options
   * @returns {string} Formatted number string
   */
  const formatNumber = (number, formatOptions = {}) => {
    const defaultOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true
    };

    const finalOptions = { ...defaultOptions, ...formatOptions };
    
    try {
      return new Intl.NumberFormat('en-US', finalOptions).format(number);
    } catch (error) {
      console.warn('Error formatting number:', error);
      return String(number);
    }
  };

  /**
   * Internal method to update the timestamp for reactivity
   */
  const updateTimestamp = () => {
    lastUpdated.value = Date.now();
  };

  /**
   * Shared method to increment the counter
   */
  const incrementCounter = () => {
    if (mixinCounter.value < SHARED_CONSTANTS.MAX_COUNTER) {
      mixinCounter.value++;
      updateTimestamp();
    } else {
      console.warn('Counter has reached maximum value');
    }
  };

  /**
   * Shared method to reset the counter
   */
  const resetCounter = () => {
    mixinCounter.value = 0;
    updateTimestamp();
  };

  /**
   * Shared utility method to validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if email is valid
   */
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Shared method to get component statistics
   * @returns {Object} Statistics object
   */
  const getStats = () => ({
    counter: mixinCounter.value,
    lastUpdated: lastUpdated.value,
    formattedLastUpdated: lastUpdated.value 
      ? new Date(lastUpdated.value).toISOString() 
      : null
  });

  // Lifecycle hooks
  onMounted(() => {
    console.log(`[useSharedFunctionality] Component "${componentName}" mounted with shared functionality`);
    
    // Initialize timestamp
    updateTimestamp();
    
    // Set up timestamp updater if enabled
    if (enableTimestampUpdates) {
      timestampInterval = setInterval(() => {
        updateTimestamp();
      }, 1000);
    }
    
    // Log available methods
    const availableMethods = [
      'formatNumber', 
      'incrementCounter', 
      'resetCounter', 
      'validateEmail',
      'getStats'
    ];
    console.log('[useSharedFunctionality] Available methods:', availableMethods);
  });

  onBeforeUnmount(() => {
    if (timestampInterval) {
      clearInterval(timestampInterval);
      console.log('[useSharedFunctionality] Timestamp interval cleared');
    }
  });

  // Return reactive state and methods
  return {
    // Reactive state
    mixinCounter,
    lastUpdated,

    // Computed properties
    currentTimestamp,
    formattedCounter,

    // Methods
    formatNumber,
    incrementCounter,
    resetCounter,
    validateEmail,
    updateTimestamp,
    getStats,

    // Constants
    SHARED_CONSTANTS
  };
}

/**
 * Lightweight version of the composable with minimal functionality
 * @returns {Object} Basic shared functionality
 */
export function useBasicSharedFunctionality() {
  const formatNumber = (number, options = {}) => {
    const defaultOptions = {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
      useGrouping: true
    };

    const finalOptions = { ...defaultOptions, ...options };
    
    try {
      return new Intl.NumberFormat('en-US', finalOptions).format(number);
    } catch (error) {
      console.warn('Error formatting number:', error);
      return String(number);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const currentTimestamp = computed(() => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(new Date());
  });

  return {
    formatNumber,
    validateEmail,
    currentTimestamp
  };
}

export default useSharedFunctionality;