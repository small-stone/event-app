# Event App

A React Native mobile application built with Expo that allows users to search and browse events from TicketMaster API. The app displays event listings with images, names, and dates, and provides detailed event information upon selection.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Building the App](#building-the-app)
- [Project Structure](#project-structure)
- [App Architecture](#app-architecture)
- [Testing](#testing)
- [API Documentation](#api-documentation)

## Features

- ✅ **Event List View**: Display events in a scrollable list with pagination
- ✅ **Search Functionality**: Real-time search with debouncing and loading indicators
- ✅ **Search History**: Recent search keywords with quick access dropdown
- ✅ **Event Details**: Detailed view of individual events
- ✅ **Pull to Refresh**: Refresh event list by pulling down
- ✅ **Infinite Scroll**: Load more events as you scroll
- ✅ **Dark/Light Mode**: Automatic theme switching
- ✅ **iOS & Android Support**: Works on both platforms
- ✅ **Unit Tests**: Comprehensive test coverage
- ✅ **State Management**: Zustand for global state management

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand (global state) + React Hooks (local state)
- **HTTP Client**: Axios
- **Testing**: Jest + React Native Testing Library
- **UI Components**: React Native core components with custom themed components
- **Icons**: Expo Vector Icons (MaterialIcons)

### Key Dependencies

- `expo`: ~54.0.31
- `react-native`: 0.81.5
- `expo-router`: ~6.0.21
- `zustand`: ^5.0.0 (state management)
- `axios`: ^1.13.2
- `react-native-reanimated`: ~4.1.1
- `jest`: ~29.7.0

## Prerequisites

Before running the app, ensure you have the following installed:

- **Node.js**: v18 or higher
- **npm**: v9 or higher (comes with Node.js)
- **Expo CLI**: Will be installed globally or via npx
- **iOS Development** (for iOS):
  - macOS with Xcode 14 or higher
  - iOS Simulator or physical device
- **Android Development** (for Android):
  - Android Studio
  - Android SDK
  - Android Emulator or physical device

## Installation

1. **Clone the repository**

   ```bash
   git clone git@github.com:small-stone/event-app.git
   cd event-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your TicketMaster API key:

   ```
   TICKETMASTER_API_KEY=your_api_key_here
   ```

   > **Note**: You can get a free API key from [TicketMaster Developer Portal](https://developer.ticketmaster.com/). Alternatively, you can use the provided API keys in the assignment document (if they haven't expired).

## Configuration

The app uses environment variables for configuration. The API key is loaded from `.env` file during build time and embedded into the app.

### Environment Variables

- `TICKETMASTER_API_KEY`: Your TicketMaster API key (required)

The `.env` file is already in `.gitignore` and will not be committed to the repository.

## Running the App

### Development Mode

1. **Start the Expo development server**

   ```bash
   npm start
   # or
   npx expo start
   ```

2. **Run on different platforms**

   - **iOS Simulator**: Press `i` in the terminal or run `npm run ios`
   - **Android Emulator**: Press `a` in the terminal or run `npm run android`
   - **Web**: Press `w` in the terminal or run `npm run web`
   - **Physical Device**: Scan the QR code with Expo Go app (iOS) or Camera app (Android)

### Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Start on iOS simulator
- `npm run android` - Start on Android emulator
- `npm run web` - Start on web browser
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Run ESLint

## Building the App

### Android APK

1. **Install EAS CLI** (if not already installed)

   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**

   ```bash
   eas login
   ```

3. **Configure EAS Build**

   ```bash
   eas build:configure
   ```

4. **Build Android APK**

   ```bash
   eas build --platform android --profile preview
   ```

   Or for production:

   ```bash
   eas build --platform android --profile production
   ```

### iOS Build

1. **Build iOS app**

   ```bash
   eas build --platform ios --profile preview
   ```

   > **Note**: iOS builds require an Apple Developer account.

### Local Builds

For local development builds:

```bash
# iOS
npx expo run:ios

# Android
npx expo run:android
```

## Project Structure

```
event-app/
├── app/                    # Expo Router pages (file-based routing)
│   ├── _layout.tsx        # Root layout
│   ├── (tabs)/            # Tab navigation group
│   │   ├── _layout.tsx    # Tab layout
│   │   ├── index.tsx      # Home screen (event list)
│   │   └── my.tsx         # My tab screen
│   └── event/
│       └── [id].tsx       # Event details page
├── components/             # Reusable React components
│   ├── __tests__/         # Component tests
│   ├── event-item.tsx     # Event list item component
│   ├── event-list.tsx     # Event list container with pagination
│   ├── search-bar.tsx     # Search input with history dropdown
│   └── ui/                 # UI components
├── constants/              # App constants
│   ├── api.ts             # API configuration
│   └── theme.ts           # Theme colors
├── hooks/                  # Custom React hooks
│   ├── use-color-scheme.ts
│   ├── use-search-debounce.ts  # Search debouncing hook
│   └── use-theme-color.ts
├── services/               # API services
│   ├── __tests__/         # Service tests
│   └── ticketmaster.ts    # TicketMaster API client
├── store/                  # Zustand state management
│   └── event-store.ts     # Global event and search state
├── utils/                  # Utility functions
│   ├── __tests__/         # Utility tests
│   └── api.ts             # Axios instance configuration
├── assets/                 # Images and static assets
├── app.config.js          # Expo configuration
├── jest.config.js         # Jest test configuration
└── package.json           # Dependencies and scripts
```

## App Architecture

### Architecture Overview

The app follows a **component-based architecture** with clear separation of concerns:

1. **Presentation Layer** (`app/`, `components/`)

   - React components for UI
   - File-based routing with Expo Router
   - Themed components for consistent styling

2. **Business Logic Layer** (`services/`, `hooks/`)

   - API service functions
   - Custom hooks for reusable logic
   - State management with React Hooks

3. **Data Layer** (`utils/api.ts`, `constants/api.ts`)
   - HTTP client configuration
   - API endpoint definitions
   - Environment variable management

### Key Design Patterns

- **Component Composition**: Reusable components with clear props interfaces
- **Custom Hooks**: Encapsulated logic for theme, color scheme, etc.
- **Service Layer**: Centralized API calls with error handling
- **File-based Routing**: Expo Router for navigation (convention over configuration)

### State Management

The app uses **Zustand** for global state management and **React Hooks** for local component state:

- **Zustand Store** (`store/event-store.ts`): Manages global application state

  - Search state (keyword, debounced keyword, loading)
  - Events list (events, pagination, loading states)
  - Search history (stores last 10 searches with quick access)
  - Centralized state updates and actions
  - Automatic deduplication of events by name

- **React Hooks**: Used for local component state
  - `useState`: Local component state
  - `useEffect`: Side effects and data fetching
  - `useCallback`: Memoized callbacks for performance
  - Custom hooks (`useSearchDebounce`) for reusable logic

**Why Zustand?**

- Lightweight and simple API
- No Provider wrapper needed
- Excellent TypeScript support
- Perfect for small to medium-sized applications
- Easy to test and maintain

### Data Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
Service Function (API Call)
    ↓
State Update (useState)
    ↓
Component Re-render
```

## Testing

The app includes comprehensive unit tests using Jest and React Native Testing Library.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **Components**: EventItem, SearchBar
- **Services**: TicketMaster API client
- **Utils**: API client, deduplication logic
- **State Management**: Zustand store actions and state updates

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## API Documentation

The app integrates with the **TicketMaster Discovery API**:

- **Base URL**: `https://app.ticketmaster.com/discovery/v2`
- **Search Events**: `/events` (with query parameters)
- **Event Details**: `/events/{id}`

### API Key Setup

1. Register at [TicketMaster Developer Portal](https://developer.ticketmaster.com/)
2. Get your API key
3. Add it to `.env` file as `TICKETMASTER_API_KEY`

### API Features Used

- Event search with keyword filtering
- Pagination support
- Event details retrieval
- Image URLs for event thumbnails
- Relevance sorting for search results
- Date sorting for default listings

## User Guide

### Search Features

1. **Basic Search**

   - Type keywords in the search bar to find events
   - Search is debounced (waits 500ms after typing stops)
   - Loading indicator shows while searching

2. **Search History**

   - Click on the search bar when empty to view recent searches
   - History dropdown appears below the search bar (floating)
   - Click any history item to quickly search again
   - Clear button to remove all search history
   - Stores up to 10 most recent searches

3. **Event List**
   - Pull down to refresh the event list
   - Scroll to bottom to load more events (infinite scroll)
   - Events are automatically deduplicated by name
   - Empty state shows helpful messages with icons

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**

   ```bash
   npx expo start --clear
   ```

2. **iOS Simulator not opening**

   - Ensure Xcode is installed
   - Try: `npx expo run:ios`
   - Or manually open Simulator and scan QR code

3. **Environment variables not loading**

   - Ensure `.env` file exists in root directory
   - Restart the development server
   - Check `app.config.js` has `require('dotenv').config()`

4. **Android build issues**

   - Ensure Android SDK is properly configured
   - Check `ANDROID_HOME` environment variable
   - Try: `npx expo run:android`

## Contributing

This is an assignment project. For questions or issues, please contact:

- Email: jiunnjye.ng@payitforward.io

## License

This project is created for assessment purposes.

## Acknowledgments

- [Expo](https://expo.dev/) for the amazing React Native framework
- [TicketMaster](https://developer.ticketmaster.com/) for providing the API
- [React Native Community](https://reactnative.dev/) for excellent documentation
