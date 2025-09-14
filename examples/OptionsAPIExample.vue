<!--
  Example component using Vue 3 Options API with the shared mixin
  
  This component demonstrates how to use the shared mixin functionality
  with Vue 3's Options API approach.
-->

<template>
  <div class="options-api-example">
    <h2>Options API Example</h2>
    <div class="info-section">
      <h3>Shared Functionality Demo</h3>
      
      <!-- Display computed properties from mixin -->
      <div class="timestamp-section">
        <label>Current Timestamp:</label>
        <span class="timestamp">{{ currentTimestamp }}</span>
      </div>
      
      <!-- Counter functionality from mixin -->
      <div class="counter-section">
        <label>{{ formattedCounter }}</label>
        <div class="button-group">
          <button @click="incrementCounter" class="btn btn-primary">
            Increment
          </button>
          <button @click="resetCounter" class="btn btn-secondary">
            Reset
          </button>
        </div>
      </div>
      
      <!-- Number formatting example -->
      <div class="number-section">
        <label>Number Formatting:</label>
        <input 
          v-model.number="numberInput" 
          type="number" 
          placeholder="Enter a number"
          class="number-input"
        >
        <span class="formatted-number">
          Formatted: {{ formatNumber(numberInput) }}
        </span>
      </div>
      
      <!-- Email validation example -->
      <div class="email-section">
        <label>Email Validation:</label>
        <input 
          v-model="emailInput" 
          type="email" 
          placeholder="Enter email"
          class="email-input"
          :class="{ 'valid': emailInput && validateEmail(emailInput), 'invalid': emailInput && !validateEmail(emailInput) }"
        >
        <span class="validation-result">
          {{ emailInput ? (validateEmail(emailInput) ? '✓ Valid' : '✗ Invalid') : '' }}
        </span>
      </div>
      
      <!-- Constants from mixin -->
      <div class="constants-section">
        <h4>Shared Constants:</h4>
        <ul>
          <li>Max Counter: {{ SHARED_CONSTANTS.MAX_COUNTER }}</li>
          <li>Min Counter: {{ SHARED_CONSTANTS.MIN_COUNTER }}</li>
          <li>Default Locale: {{ SHARED_CONSTANTS.DEFAULT_LOCALE }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { sharedMixin } from '../mixins/sharedMixin.js';

export default {
  name: 'OptionsAPIExample',
  
  // Use the shared mixin
  mixins: [sharedMixin],
  
  data() {
    return {
      numberInput: 12345.67,
      emailInput: '',
      // Disable auto timestamp updates for this component
      enableTimestampUpdates: false
    };
  },
  
  computed: {
    // Component-specific computed property that uses mixin functionality
    componentStats() {
      return {
        counter: this.mixinCounter,
        hasValidEmail: this.emailInput ? this.validateEmail(this.emailInput) : false,
        formattedNumber: this.formatNumber(this.numberInput || 0)
      };
    }
  },
  
  methods: {
    // Component-specific method that uses mixin functionality
    handleFormSubmit() {
      if (this.validateEmail(this.emailInput)) {
        console.log('Form submitted with valid email:', this.emailInput);
        console.log('Current counter:', this.formattedCounter);
        console.log('Formatted number:', this.formatNumber(this.numberInput));
      } else {
        alert('Please enter a valid email');
      }
    },
    
    // Override or extend mixin behavior if needed
    resetCounter() {
      // Call the mixin method
      this.mixinCounter = 0;
      this.updateTimestamp();
      
      // Add component-specific logic
      console.log('Counter reset in Options API component');
    }
  },
  
  // Lifecycle hooks work alongside mixin hooks
  mounted() {
    console.log('[OptionsAPIExample] Component mounted');
    console.log('[OptionsAPIExample] Available mixin functionality:', this.componentStats);
    
    // Enable manual timestamp updates every 2 seconds
    this._customInterval = setInterval(() => {
      this.updateTimestamp();
    }, 2000);
  },
  
  beforeUnmount() {
    if (this._customInterval) {
      clearInterval(this._customInterval);
    }
  }
};
</script>

<style scoped>
.options-api-example {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

.info-section {
  margin-top: 20px;
}

.timestamp-section,
.counter-section,
.number-section,
.email-section,
.constants-section {
  margin: 20px 0;
  padding: 15px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.timestamp {
  font-family: monospace;
  font-weight: bold;
  color: #2c3e50;
}

.button-group {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:hover {
  opacity: 0.8;
}

.number-input,
.email-input {
  margin: 0 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.email-input.valid {
  border-color: #28a745;
}

.email-input.invalid {
  border-color: #dc3545;
}

.formatted-number {
  font-weight: bold;
  color: #28a745;
}

.validation-result {
  margin-left: 10px;
  font-weight: bold;
}

.constants-section ul {
  list-style-type: none;
  padding: 0;
}

.constants-section li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

label {
  font-weight: bold;
  margin-right: 10px;
}
</style>