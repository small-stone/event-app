import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { TICKETMASTER_BASE_URL, TICKETMASTER_API_KEY } from '@/constants/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: TICKETMASTER_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add API key to all requests
apiClient.interceptors.request.use(
  (config) => {
    // Add API key as query parameter
    config.params = {
      ...config.params,
      apikey: TICKETMASTER_API_KEY,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Generic API request function
export const apiRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient;
