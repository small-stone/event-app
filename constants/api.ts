import Constants from 'expo-constants';

// TicketMaster API configuration
// Get API key from environment variables (via app.config.js)
export const TICKETMASTER_API_KEY =
  Constants.expoConfig?.extra?.ticketmasterApiKey ||
  process.env.TICKETMASTER_API_KEY ||
  'AJIubp2Y9E8NY4rBrYmVt2nJqHjghF8S'; // Fallback to default key

export const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
