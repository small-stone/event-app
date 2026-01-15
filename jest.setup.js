// Mock expo winter runtime FIRST before any other imports
jest.mock('expo/src/winter/runtime.native', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

jest.mock('expo/src/winter/installGlobal', () => ({
  __esModule: true,
  default: {},
}), { virtual: true });

import '@testing-library/jest-native/extend-expect';

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: 'Image',
}));

// Mock expo-status-bar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: 'SafeAreaView',
  SafeAreaProvider: ({ children }: any) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  try {
    const Reanimated = require('react-native-reanimated/mock');
    Reanimated.default.call = () => {};
    return Reanimated;
  } catch {
    return {
      default: {
        View: 'Animated.View',
        Text: 'Animated.Text',
        ScrollView: 'Animated.ScrollView',
      },
      useSharedValue: () => ({ value: 0 }),
      useAnimatedStyle: () => ({}),
      withTiming: (value: any) => value,
      withRepeat: (value: any) => value,
      withSequence: (value: any) => value,
    };
  }
});

// Mock expo-constants
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        ticketmasterApiKey: 'test-key',
      },
    },
  },
}));

// Mock constants/api to avoid expo-constants import issues
jest.mock('@/constants/api', () => ({
  TICKETMASTER_API_KEY: 'test-key',
  TICKETMASTER_BASE_URL: 'https://app.ticketmaster.com/discovery/v2',
}));
