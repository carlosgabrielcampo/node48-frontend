# Testing Setup

This project uses Vitest for testing React components with React Testing Library.

## Setup

The testing framework has been configured with:

- **Vitest**: Fast testing framework for Vite projects
- **React Testing Library**: For testing React components
- **@testing-library/jest-dom**: Additional Jest matchers for DOM testing
- **@testing-library/user-event**: For simulating user interactions
- **jsdom**: For DOM environment in tests

## Configuration

- `vitest.config.ts`: Main test configuration
- `src/test/setup.ts`: Test setup file that configures jest-dom
- Path aliases are configured to work in tests

## Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Files

- `src/lib/utils.test.ts`: Tests for utility functions
- `src/hooks/useMobile.test.tsx`: Tests for the useMobile hook
- `src/App.test.tsx`: Basic tests for the App component

## Writing Tests

### Component Testing

```tsx
import { render, screen } from '@testing-library/react'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Hook Testing

```tsx
import { renderHook } from '@testing-library/react'
import { useMyHook } from './useMyHook'

describe('useMyHook', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current).toBe('expected value')
  })
})
```

### Mocking

Use `vi.mock()` to mock modules:

```tsx
vi.mock('@/services/api', () => ({
  apiService: {
    getData: vi.fn()
  }
}))
```

## Best Practices

1. Use descriptive test names
2. Test user behavior, not implementation details
3. Mock external dependencies
4. Use `screen` queries instead of `container` queries when possible
5. Clean up after tests with `beforeEach` and `afterEach`
6. Use `waitFor` for asynchronous operations