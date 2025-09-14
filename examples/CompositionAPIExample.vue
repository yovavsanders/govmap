<!--
  Example component using Vue 3 Composition API with the shared composable
  
  This component demonstrates how to use the shared functionality
  with Vue 3's Composition API approach.
-->

<template>
  <div class="composition-api-example">
    <h2>Composition API Example</h2>
    <div class="info-section">
      <h3>Shared Functionality Demo</h3>
      
      <!-- Display computed properties from composable -->
      <div class="timestamp-section">
        <label>Current Timestamp:</label>
        <span class="timestamp">{{ currentTimestamp }}</span>
      </div>
      
      <!-- Counter functionality from composable -->
      <div class="counter-section">
        <label>{{ formattedCounter }}</label>
        <div class="button-group">
          <button @click="incrementCounter" class="btn btn-primary">
            Increment
          </button>
          <button @click="resetCounter" class="btn btn-secondary">
            Reset
          </button>
          <button @click="handleBatchIncrement" class="btn btn-info">
            +10
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
        <div class="format-options">
          <label>
            <input v-model="useCurrency" type="checkbox"> 
            Currency Format
          </label>
        </div>
        <span v-if="useCurrency" class="formatted-number">
          Currency: {{ formatNumber(numberInput, { style: 'currency', currency: 'USD' }) }}
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
      
      <!-- Statistics from composable -->
      <div class="stats-section">
        <h4>Component Statistics:</h4>
        <pre>{{ JSON.stringify(getStats(), null, 2) }}</pre>
      </div>
      
      <!-- Constants from composable -->
      <div class="constants-section">
        <h4>Shared Constants:</h4>
        <ul>
          <li>Max Counter: {{ SHARED_CONSTANTS.MAX_COUNTER }}</li>
          <li>Min Counter: {{ SHARED_CONSTANTS.MIN_COUNTER }}</li>
          <li>Default Locale: {{ SHARED_CONSTANTS.DEFAULT_LOCALE }}</li>
        </ul>
      </div>
      
      <!-- Custom functionality using composable -->
      <div class="custom-section">
        <h4>Custom Component Logic:</h4>
        <p>Double Counter: {{ doubleCounter }}</p>
        <p>Counter Progress: {{ counterProgress }}%</p>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: counterProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useSharedFunctionality } from '../composables/useSharedFunctionality.js';

export default {
  name: 'CompositionAPIExample',
  
  setup() {
    // Use the shared composable
    const {
      mixinCounter,
      currentTimestamp,
      formattedCounter,
      formatNumber,
      incrementCounter,
      resetCounter,
      validateEmail,
      getStats,
      SHARED_CONSTANTS
    } = useSharedFunctionality({
      enableTimestampUpdates: true,
      componentName: 'CompositionAPIExample'
    });
    
    // Component-specific reactive state
    const numberInput = ref(98765.43);
    const emailInput = ref('');
    const useCurrency = ref(false);
    
    // Component-specific computed properties that use shared functionality
    const doubleCounter = computed(() => mixinCounter.value * 2);
    
    const counterProgress = computed(() => {
      return Math.min((mixinCounter.value / SHARED_CONSTANTS.MAX_COUNTER) * 100, 100);
    });
    
    // Component-specific methods that use shared functionality
    const handleBatchIncrement = () => {
      for (let i = 0; i < 10; i++) {
        incrementCounter();
      }
    };
    
    const handleFormSubmit = () => {
      if (validateEmail(emailInput.value)) {
        console.log('Form submitted with valid email:', emailInput.value);
        console.log('Current counter:', formattedCounter.value);
        console.log('Formatted number:', formatNumber(numberInput.value));
        console.log('Component stats:', getStats());
      } else {
        alert('Please enter a valid email');
      }
    };
    
    // Watchers using shared functionality
    watch(mixinCounter, (newValue, oldValue) => {
      console.log(`[CompositionAPI] Counter changed from ${oldValue} to ${newValue}`);
      
      if (newValue >= SHARED_CONSTANTS.MAX_COUNTER) {
        console.warn('Counter reached maximum value!');
      }
    });
    
    watch(emailInput, (newEmail) => {
      if (newEmail && validateEmail(newEmail)) {
        console.log('Valid email entered:', newEmail);
      }
    });
    
    // Return everything the template needs
    return {
      // Shared functionality
      mixinCounter,
      currentTimestamp,
      formattedCounter,
      formatNumber,
      incrementCounter,
      resetCounter,
      validateEmail,
      getStats,
      SHARED_CONSTANTS,
      
      // Component-specific state
      numberInput,
      emailInput,
      useCurrency,
      
      // Component-specific computed
      doubleCounter,
      counterProgress,
      
      // Component-specific methods
      handleBatchIncrement,
      handleFormSubmit
    };
  }
};
</script>

<style scoped>
.composition-api-example {
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
.stats-section,
.constants-section,
.custom-section {
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
  flex-wrap: wrap;
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

.btn-info {
  background-color: #17a2b8;
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
  display: block;
  margin: 5px 0;
}

.format-options {
  margin: 10px 0;
}

.validation-result {
  margin-left: 10px;
  font-weight: bold;
}

.stats-section pre {
  background: #fff;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
}

.constants-section ul {
  list-style-type: none;
  padding: 0;
}

.constants-section li {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
}

label {
  font-weight: bold;
  margin-right: 10px;
}
</style>