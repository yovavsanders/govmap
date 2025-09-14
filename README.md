# Vue 3 Mixin Implementation

This directory contains a Vue 3 mixin implementation that provides reusable functionality across multiple components.

## Features

- **Options API Mixin**: Traditional Vue mixin for Options API usage
- **Composition API Functions**: Modern composable functions for Composition API usage
- **Cross-API Compatibility**: Works with both Vue 3 Options API and Composition API

## Structure

- `mixins/` - Contains mixin implementations
- `composables/` - Contains Composition API functions
- `examples/` - Example components demonstrating usage
- `tests/` - Test files for validation

## Usage

### Options API
```javascript
import { sharedMixin } from './mixins/sharedMixin.js';

export default {
  mixins: [sharedMixin],
  // Your component code
}
```

### Composition API
```javascript
import { useSharedFunctionality } from './composables/useSharedFunctionality.js';

export default {
  setup() {
    const { computedValue, sharedMethod, onMountedHook } = useSharedFunctionality();
    
    return {
      computedValue,
      sharedMethod
    };
  }
}
```