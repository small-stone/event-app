# Testing Guide

This project includes unit tests for key components and services. The tests are set up using Jest and React Native Testing Library.

## Test Files

The following test files have been created:

1. **`components/__tests__/event-item.test.tsx`** - Tests for the EventItem component
   - Renders event name and date
   - Handles navigation to event details
   - Handles events without images or dates
   - Uses fallback images when needed

2. **`components/__tests__/search-bar.test.tsx`** - Tests for the SearchBar component
   - Renders search input
   - Handles text changes
   - Shows/hides clear button
   - Calls onClear callback

3. **`services/__tests__/ticketmaster.test.ts`** - Tests for TicketMaster API service
   - Searches events with default parameters
   - Searches events with keyword and filters
   - Handles pagination
   - Gets event details by ID
   - Handles API errors

4. **`utils/__tests__/api.test.ts`** - Tests for API client
   - Makes GET requests
   - Handles request and network errors

5. **`utils/__tests__/deduplication.test.ts`** - Tests for deduplication logic
   - Removes duplicate events by name
   - Handles case-insensitive duplicates
   - Handles whitespace differences
   - Handles empty arrays and edge cases

## Running Tests

To run all tests:
```bash
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

To run tests with coverage:
```bash
npm run test:coverage
```

## Test Configuration

- **Jest Preset**: `jest-expo` - Configured for Expo/React Native projects
- **Testing Library**: `@testing-library/react-native` - For component testing
- **Setup File**: `jest.setup.js` - Contains mocks for Expo modules

## Mocked Modules

The following modules are mocked in `jest.setup.js`:
- `expo-router` - Navigation hooks
- `expo-image` - Image component
- `expo-status-bar` - Status bar component
- `react-native-safe-area-context` - Safe area hooks
- `react-native-reanimated` - Animation library
- `expo-constants` - Constants and config

## Test Coverage

The tests cover:
- ✅ Component rendering and user interactions
- ✅ API service functions and error handling
- ✅ Utility functions (deduplication)
- ✅ Navigation behavior
- ✅ Edge cases (missing data, empty states)

## Notes

If you encounter issues with Expo's winter runtime when running tests, you may need to:
1. Clear Jest cache: `npm test -- --clearCache`
2. Update dependencies: `npm install`
3. Check Expo SDK version compatibility
