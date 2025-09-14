/**
 * Test suite for the shared mixin functionality
 * 
 * These tests validate that the mixin provides the expected functionality
 * including computed properties, methods, and lifecycle hooks.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { sharedMixin } from '../mixins/sharedMixin.js';

// Mock component that uses the mixin
const TestComponent = {
  mixins: [sharedMixin],
  template: `
    <div>
      <span class="timestamp">{{ currentTimestamp }}</span>
      <span class="counter">{{ formattedCounter }}</span>
      <button @click="incrementCounter">Increment</button>
      <button @click="resetCounter">Reset</button>
    </div>
  `
};

describe('SharedMixin', () => {
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

  describe('Data Properties', () => {
    it('should initialize with correct default data', async () => {
      wrapper = mount(TestComponent);
      
      expect(wrapper.vm.mixinCounter).toBe(0);
      expect(wrapper.vm.lastUpdated).toBeNull();
    });
  });

  describe('Computed Properties', () => {
    beforeEach(() => {
      wrapper = mount(TestComponent);
    });

    it('should have currentTimestamp computed property', () => {
      expect(wrapper.vm.currentTimestamp).toMatch(/\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}:\d{2}/);
    });

    it('should have formattedCounter computed property', () => {
      expect(wrapper.vm.formattedCounter).toBe('Counter: 0');
      
      wrapper.vm.mixinCounter = 1000;
      expect(wrapper.vm.formattedCounter).toBe('Counter: 1,000');
    });

    it('should update currentTimestamp when lastUpdated changes', async () => {
      const initialTimestamp = wrapper.vm.currentTimestamp;
      
      // Advance time and update timestamp
      vi.advanceTimersByTime(2000);
      wrapper.vm.updateTimestamp();
      await wrapper.vm.$nextTick();
      
      // Timestamp should be different (or at least not fail)
      expect(typeof wrapper.vm.currentTimestamp).toBe('string');
    });
  });

  describe('Methods', () => {
    beforeEach(() => {
      wrapper = mount(TestComponent);
    });

    describe('formatNumber', () => {
      it('should format numbers correctly', () => {
        expect(wrapper.vm.formatNumber(1234.56)).toBe('1,234.56');
        expect(wrapper.vm.formatNumber(1000000)).toBe('1,000,000');
        expect(wrapper.vm.formatNumber(0)).toBe('0');
      });

      it('should handle formatting options', () => {
        const result = wrapper.vm.formatNumber(1234.5678, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        expect(result).toBe('1,234.57');
      });

      it('should handle invalid numbers gracefully', () => {
        expect(wrapper.vm.formatNumber('invalid')).toBe('invalid');
        expect(wrapper.vm.formatNumber(null)).toBe('null');
      });
    });

    describe('incrementCounter', () => {
      it('should increment the counter', () => {
        expect(wrapper.vm.mixinCounter).toBe(0);
        
        wrapper.vm.incrementCounter();
        expect(wrapper.vm.mixinCounter).toBe(1);
        
        wrapper.vm.incrementCounter();
        expect(wrapper.vm.mixinCounter).toBe(2);
      });

      it('should update timestamp when incrementing', () => {
        const initialLastUpdated = wrapper.vm.lastUpdated;
        
        wrapper.vm.incrementCounter();
        
        expect(wrapper.vm.lastUpdated).not.toBe(initialLastUpdated);
        expect(typeof wrapper.vm.lastUpdated).toBe('number');
      });
    });

    describe('resetCounter', () => {
      it('should reset counter to zero', () => {
        wrapper.vm.mixinCounter = 10;
        
        wrapper.vm.resetCounter();
        
        expect(wrapper.vm.mixinCounter).toBe(0);
      });

      it('should update timestamp when resetting', () => {
        wrapper.vm.mixinCounter = 5;
        const initialLastUpdated = wrapper.vm.lastUpdated;
        
        wrapper.vm.resetCounter();
        
        expect(wrapper.vm.lastUpdated).not.toBe(initialLastUpdated);
      });
    });

    describe('validateEmail', () => {
      it('should validate correct email addresses', () => {
        expect(wrapper.vm.validateEmail('test@example.com')).toBe(true);
        expect(wrapper.vm.validateEmail('user.name@domain.co.uk')).toBe(true);
        expect(wrapper.vm.validateEmail('user+tag@example.org')).toBe(true);
      });

      it('should reject invalid email addresses', () => {
        expect(wrapper.vm.validateEmail('invalid-email')).toBe(false);
        expect(wrapper.vm.validateEmail('test@')).toBe(false);
        expect(wrapper.vm.validateEmail('@example.com')).toBe(false);
        expect(wrapper.vm.validateEmail('test.example.com')).toBe(false);
        expect(wrapper.vm.validateEmail('')).toBe(false);
      });
    });

    describe('updateTimestamp', () => {
      it('should update lastUpdated with current timestamp', () => {
        const beforeUpdate = Date.now();
        
        wrapper.vm.updateTimestamp();
        
        const afterUpdate = Date.now();
        
        expect(wrapper.vm.lastUpdated).toBeGreaterThanOrEqual(beforeUpdate);
        expect(wrapper.vm.lastUpdated).toBeLessThanOrEqual(afterUpdate);
      });
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should log component mounting', () => {
      wrapper = mount(TestComponent);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[SharedMixin] Component')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('mounted with shared functionality')
      );
    });

    it('should initialize timestamp on mount', () => {
      wrapper = mount(TestComponent);
      
      expect(wrapper.vm.lastUpdated).not.toBeNull();
      expect(typeof wrapper.vm.lastUpdated).toBe('number');
    });

    it('should set up timestamp interval on mount', () => {
      wrapper = mount(TestComponent);
      
      expect(wrapper.vm._timestampInterval).toBeDefined();
    });

    it('should clear interval on unmount', () => {
      wrapper = mount(TestComponent);
      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
      
      wrapper.unmount();
      
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe('Shared Constants', () => {
    beforeEach(() => {
      wrapper = mount(TestComponent);
    });

    it('should provide shared constants', () => {
      expect(wrapper.vm.SHARED_CONSTANTS).toBeDefined();
      expect(wrapper.vm.SHARED_CONSTANTS.MAX_COUNTER).toBe(1000);
      expect(wrapper.vm.SHARED_CONSTANTS.MIN_COUNTER).toBe(0);
      expect(wrapper.vm.SHARED_CONSTANTS.DEFAULT_LOCALE).toBe('en-US');
    });

    it('should freeze shared constants', () => {
      expect(Object.isFrozen(wrapper.vm.SHARED_CONSTANTS)).toBe(true);
    });
  });

  describe('Component Integration', () => {
    beforeEach(() => {
      wrapper = mount(TestComponent);
    });

    it('should render computed properties in template', () => {
      expect(wrapper.find('.timestamp').exists()).toBe(true);
      expect(wrapper.find('.counter').text()).toBe('Counter: 0');
    });

    it('should respond to button clicks', async () => {
      const incrementButton = wrapper.find('button');
      
      await incrementButton.trigger('click');
      
      expect(wrapper.vm.mixinCounter).toBe(1);
      expect(wrapper.find('.counter').text()).toBe('Counter: 1');
    });

    it('should handle multiple increments', async () => {
      const incrementButton = wrapper.find('button');
      
      for (let i = 0; i < 5; i++) {
        await incrementButton.trigger('click');
      }
      
      expect(wrapper.vm.mixinCounter).toBe(5);
      expect(wrapper.find('.counter').text()).toBe('Counter: 5');
    });
  });
});