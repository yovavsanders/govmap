/**
 * Test suite for the shared composable functionality
 * 
 * These tests validate that the composable provides the expected functionality
 * including reactive state, computed properties, and methods.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { useSharedFunctionality, useBasicSharedFunctionality } from '../composables/useSharedFunctionality.js';

// Mock component that uses the composable
const TestComponent = {
  setup() {
    const shared = useSharedFunctionality({
      enableTimestampUpdates: false,
      componentName: 'TestComponent'
    });
    
    return shared;
  },
  template: `
    <div>
      <span class="timestamp">{{ currentTimestamp }}</span>
      <span class="counter">{{ formattedCounter }}</span>
      <button @click="incrementCounter" class="increment">Increment</button>
      <button @click="resetCounter" class="reset">Reset</button>
    </div>
  `
};

// Mock component for basic functionality testing
const BasicTestComponent = {
  setup() {
    const basic = useBasicSharedFunctionality();
    return basic;
  },
  template: `
    <div>
      <span class="timestamp">{{ currentTimestamp }}</span>
    </div>
  `
};

describe('useSharedFunctionality', () => {
  let wrapper;
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Composable Setup', () => {
    it('should return all expected properties and methods', () => {
      const result = useSharedFunctionality();
      
      // Check reactive state
      expect(result.mixinCounter).toBeDefined();
      expect(result.lastUpdated).toBeDefined();
      
      // Check computed properties
      expect(result.currentTimestamp).toBeDefined();
      expect(result.formattedCounter).toBeDefined();
      
      // Check methods
      expect(typeof result.formatNumber).toBe('function');
      expect(typeof result.incrementCounter).toBe('function');
      expect(typeof result.resetCounter).toBe('function');
      expect(typeof result.validateEmail).toBe('function');
      expect(typeof result.getStats).toBe('function');
      
      // Check constants
      expect(result.SHARED_CONSTANTS).toBeDefined();
    });

    it('should accept configuration options', () => {
      const options = {
        enableTimestampUpdates: false,
        componentName: 'CustomComponent'
      };
      
      const result = useSharedFunctionality(options);
      
      expect(result).toBeDefined();
      // Component name is used in logging, verified in lifecycle tests
    });
  });

  describe('Reactive State', () => {
    beforeEach(() => {
      wrapper = mount(TestComponent);
    });

    it('should initialize with correct default values', () => {
      expect(wrapper.vm.mixinCounter).toBe(0);
      expect(wrapper.vm.lastUpdated).toBe(null);
    });

    it('should maintain reactivity when counter changes', async () => {
      expect(wrapper.find('.counter').text()).toBe('Counter: 0');
      
      wrapper.vm.incrementCounter();
      await nextTick();
      
      expect(wrapper.find('.counter').text()).toBe('Counter: 1');
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      wrapper = mount(TestComponent);
    });

    it('should provide currentTimestamp', () => {
      const timestamp = wrapper.vm.currentTimestamp;
      expect(timestamp).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/);
    });

    it('should provide formattedCounter', () => {
      expect(wrapper.vm.formattedCounter).toBe('Counter: 0');
      
      wrapper.vm.mixinCounter = 1000;
      expect(wrapper.vm.formattedCounter).toBe('Counter: 1,000');
    });

    it('should update computed properties reactively', async () => {
      const initialTimestamp = wrapper.vm.currentTimestamp;
      
      wrapper.vm.updateTimestamp();
      await nextTick();
      
      // Should still be a valid timestamp format
      expect(wrapper.vm.currentTimestamp).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/);
    });
  });

  describe('Methods', () => {
    let composable;

    beforeEach(() => {
      composable = useSharedFunctionality({
        enableTimestampUpdates: false,
        componentName: 'TestComposable'
      });
    });

    describe('formatNumber', () => {
      it('should format numbers correctly', () => {
        expect(composable.formatNumber(1234.56)).toBe('1,234.56');
        expect(composable.formatNumber(1000000)).toBe('1,000,000');
        expect(composable.formatNumber(0)).toBe('0');
      });

      it('should handle formatting options', () => {
        const result = composable.formatNumber(1234.5678, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        expect(result).toBe('1,234.57');
      });

      it('should handle currency formatting', () => {
        const result = composable.formatNumber(1234.56, {
          style: 'currency',
          currency: 'USD'
        });
        expect(result).toBe('$1,234.56');
      });
    });

    describe('incrementCounter', () => {
      it('should increment the counter', () => {
        expect(composable.mixinCounter.value).toBe(0);
        
        composable.incrementCounter();
        expect(composable.mixinCounter.value).toBe(1);
        
        composable.incrementCounter();
        expect(composable.mixinCounter.value).toBe(2);
      });

      it('should respect maximum counter limit', () => {
        // Set counter near maximum
        composable.mixinCounter.value = composable.SHARED_CONSTANTS.MAX_COUNTER;
        
        const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        
        composable.incrementCounter();
        
        expect(composable.mixinCounter.value).toBe(composable.SHARED_CONSTANTS.MAX_COUNTER);
        expect(consoleWarnSpy).toHaveBeenCalledWith('Counter has reached maximum value');
        
        consoleWarnSpy.mockRestore();
      });

      it('should update timestamp when incrementing', () => {
        const initialLastUpdated = composable.lastUpdated.value;
        
        composable.incrementCounter();
        
        expect(composable.lastUpdated.value).not.toBe(initialLastUpdated);
      });
    });

    describe('resetCounter', () => {
      it('should reset counter to zero', () => {
        composable.mixinCounter.value = 10;
        
        composable.resetCounter();
        
        expect(composable.mixinCounter.value).toBe(0);
      });

      it('should update timestamp when resetting', () => {
        composable.mixinCounter.value = 5;
        const initialLastUpdated = composable.lastUpdated.value;
        
        composable.resetCounter();
        
        expect(composable.lastUpdated.value).not.toBe(initialLastUpdated);
      });
    });

    describe('validateEmail', () => {
      it('should validate correct email addresses', () => {
        expect(composable.validateEmail('test@example.com')).toBe(true);
        expect(composable.validateEmail('user.name@domain.co.uk')).toBe(true);
        expect(composable.validateEmail('user+tag@example.org')).toBe(true);
      });

      it('should reject invalid email addresses', () => {
        expect(composable.validateEmail('invalid-email')).toBe(false);
        expect(composable.validateEmail('test@')).toBe(false);
        expect(composable.validateEmail('@example.com')).toBe(false);
        expect(composable.validateEmail('')).toBe(false);
      });
    });

    describe('getStats', () => {
      it('should return correct statistics', () => {
        composable.mixinCounter.value = 5;
        composable.updateTimestamp();
        
        const stats = composable.getStats();
        
        expect(stats.counter).toBe(5);
        expect(typeof stats.lastUpdated).toBe('number');
        expect(typeof stats.formattedLastUpdated).toBe('string');
      });

      it('should handle null lastUpdated', () => {
        const stats = composable.getStats();
        
        expect(stats.counter).toBe(0);
        expect(stats.lastUpdated).toBe(null);
        expect(stats.formattedLastUpdated).toBe(null);
      });
    });
  });

  describe('Lifecycle Integration', () => {
    it('should log component mounting', () => {
      mount(TestComponent);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[useSharedFunctionality] Component "TestComponent" mounted')
      );
    });

    it('should setup timestamp interval when enabled', () => {
      const setIntervalSpy = vi.spyOn(global, 'setInterval');
      
      const TestComponentWithInterval = {
        setup() {
          return useSharedFunctionality({
            enableTimestampUpdates: true,
            componentName: 'IntervalTest'
          });
        },
        template: '<div></div>'
      };
      
      mount(TestComponentWithInterval);
      
      expect(setIntervalSpy).toHaveBeenCalled();
    });

    it('should not setup interval when disabled', () => {
      const setIntervalSpy = vi.spyOn(global, 'setInterval');
      
      mount(TestComponent); // Uses enableTimestampUpdates: false
      
      expect(setIntervalSpy).not.toHaveBeenCalled();
    });

    it('should cleanup interval on unmount', () => {
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      const TestComponentWithInterval = {
        setup() {
          return useSharedFunctionality({
            enableTimestampUpdates: true,
            componentName: 'CleanupTest'
          });
        },
        template: '<div></div>'
      };
      
      const wrapper = mount(TestComponentWithInterval);
      wrapper.unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('Constants', () => {
    it('should provide frozen constants', () => {
      const composable = useSharedFunctionality();
      
      expect(composable.SHARED_CONSTANTS.MAX_COUNTER).toBe(1000);
      expect(composable.SHARED_CONSTANTS.MIN_COUNTER).toBe(0);
      expect(composable.SHARED_CONSTANTS.DEFAULT_LOCALE).toBe('en-US');
      expect(Object.isFrozen(composable.SHARED_CONSTANTS)).toBe(true);
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      wrapper = mount(TestComponent);
    });

    it('should render in template correctly', () => {
      expect(wrapper.find('.timestamp').exists()).toBe(true);
      expect(wrapper.find('.counter').text()).toBe('Counter: 0');
    });

    it('should handle user interactions', async () => {
      const incrementButton = wrapper.find('.increment');
      
      await incrementButton.trigger('click');
      
      expect(wrapper.vm.mixinCounter).toBe(1);
      expect(wrapper.find('.counter').text()).toBe('Counter: 1');
    });

    it('should handle reset functionality', async () => {
      // First increment
      await wrapper.find('.increment').trigger('click');
      expect(wrapper.find('.counter').text()).toBe('Counter: 1');
      
      // Then reset
      await wrapper.find('.reset').trigger('click');
      expect(wrapper.find('.counter').text()).toBe('Counter: 0');
    });
  });
});

describe('useBasicSharedFunctionality', () => {
  it('should provide basic functionality', () => {
    const basic = useBasicSharedFunctionality();
    
    expect(typeof basic.formatNumber).toBe('function');
    expect(typeof basic.validateEmail).toBe('function');
    expect(basic.currentTimestamp).toBeDefined();
  });

  it('should format numbers correctly', () => {
    const basic = useBasicSharedFunctionality();
    
    expect(basic.formatNumber(1234.56)).toBe('1,234.56');
  });

  it('should validate emails correctly', () => {
    const basic = useBasicSharedFunctionality();
    
    expect(basic.validateEmail('test@example.com')).toBe(true);
    expect(basic.validateEmail('invalid')).toBe(false);
  });

  it('should render timestamp in component', () => {
    const wrapper = mount(BasicTestComponent);
    
    expect(wrapper.find('.timestamp').exists()).toBe(true);
    expect(wrapper.find('.timestamp').text()).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/);
    
    wrapper.unmount();
  });
});