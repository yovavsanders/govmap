/**
 * Shared Mixin for Vue 3 Options API
 * 
 * This mixin provides reusable functionality that can be shared across multiple components.
 * It includes a computed property, a method, and a lifecycle hook.
 * 
 * Features:
 * - Computed property: currentTimestamp - returns formatted current date/time
 * - Method: formatNumber - formats numbers with proper localization  
 * - Lifecycle hook: mounted - logs component initialization
 */

export const sharedMixin = {
  data() {
    return {
      // Shared reactive data
      mixinCounter: 0,
      lastUpdated: null
    };
  },

  computed: {
    /**
     * Computed property that returns formatted current timestamp
     * Updates every second when component is active
     */
    currentTimestamp() {
      // Trigger reactivity by accessing lastUpdated
      this.lastUpdated;
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
    },

    /**
     * Computed property that returns counter with formatted display
     */
    formattedCounter() {
      return `Counter: ${this.formatNumber(this.mixinCounter)}`;
    }
  },

  methods: {
    /**
     * Shared method to format numbers with proper localization
     * @param {number} number - The number to format
     * @param {object} options - Formatting options
     * @returns {string} Formatted number string
     */
    formatNumber(number, options = {}) {
      const defaultOptions = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: true
      };

      const formatOptions = { ...defaultOptions, ...options };
      
      try {
        return new Intl.NumberFormat('en-US', formatOptions).format(number);
      } catch (error) {
        console.warn('Error formatting number:', error);
        return String(number);
      }
    },

    /**
     * Shared method to increment the counter
     */
    incrementCounter() {
      this.mixinCounter++;
      this.updateTimestamp();
    },

    /**
     * Shared method to reset the counter
     */
    resetCounter() {
      this.mixinCounter = 0;
      this.updateTimestamp();
    },

    /**
     * Internal method to update the timestamp for reactivity
     */
    updateTimestamp() {
      this.lastUpdated = Date.now();
    },

    /**
     * Shared utility method to validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  },

  /**
   * Mounted lifecycle hook - shared initialization logic
   */
  mounted() {
    console.log(`[SharedMixin] Component "${this.$options.name || 'Unknown'}" mounted with shared functionality`);
    
    // Initialize timestamp
    this.updateTimestamp();
    
    // Set up timestamp updater (optional - can be enabled per component)
    if (this.enableTimestampUpdates !== false) {
      this._timestampInterval = setInterval(() => {
        this.updateTimestamp();
      }, 1000);
    }
    
    // Log available mixin methods
    const mixinMethods = ['formatNumber', 'incrementCounter', 'resetCounter', 'validateEmail'];
    console.log('[SharedMixin] Available methods:', mixinMethods);
  },

  /**
   * Before unmount lifecycle hook - cleanup
   */
  beforeUnmount() {
    if (this._timestampInterval) {
      clearInterval(this._timestampInterval);
      console.log('[SharedMixin] Timestamp interval cleared');
    }
  },

  /**
   * Provide shared constants or configuration
   */
  created() {
    // Shared constants available to all components using this mixin
    this.SHARED_CONSTANTS = Object.freeze({
      MAX_COUNTER: 1000,
      MIN_COUNTER: 0,
      DEFAULT_LOCALE: 'en-US',
      TIMESTAMP_FORMAT: 'YYYY-MM-DD HH:mm:ss'
    });
  }
};

export default sharedMixin;