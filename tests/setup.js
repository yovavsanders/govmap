/**
 * Test setup file for Vitest
 */

// Mock global objects if needed
global.console = {
  ...console,
  // Suppress logs during tests unless explicitly testing them
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn()
};

// Setup DOM environment if needed
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000'
  },
  writable: true
});

// Mock Intl if not available in test environment
if (!global.Intl) {
  global.Intl = {
    DateTimeFormat: class {
      constructor() {}
      format(date) {
        return date.toISOString();
      }
    },
    NumberFormat: class {
      constructor() {}
      format(number) {
        return String(number);
      }
    }
  };
}