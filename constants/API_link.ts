import Constants from 'expo-constants';

const getApiUrl = (): string => {
  // Get the API URL from environment variables
  const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL || Constants.expoConfig?.extra?.apiUrl;
  
  if (apiUrl) {
    return apiUrl;
  }
  
  // Fallback for development
  if (__DEV__) {
    // For development, you might want to use your local IP or localhost
    return 'http://localhost:5000';
  }
  
  // Production fallback - should be set via environment variables
  throw new Error('API_BASE_URL not configured');
};

export const API_LINK = getApiUrl();