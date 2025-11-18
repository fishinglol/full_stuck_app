// api.js
import { Platform, Alert } from 'react-native';

const BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:8000',
  android: 'http://10.0.2.2:8000',
  default: 'http://127.0.0.1:8000',  // Your FastAPI server
});

export const callAPI = async (endpoint, method = 'GET', body = null) => {
  try {
    console.log(`🚀 Making API call to: ${BASE_URL}${endpoint}`);
    console.log('📤 Request method:', method);
    console.log('📤 Request body:', body);

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    // Only add body for non-GET requests
    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', response.headers);

    // Check if the response is JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      console.log('📥 Non-JSON response:', text);
      data = { message: text, user: null };
    }
    
    console.log('📥 Response data:', data);

    if (!response.ok) {
      // Handle different types of errors
      let errorMessage = 'An error occurred';
      
      if (data.detail) {
        // FastAPI error format
        errorMessage = data.detail;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (response.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (response.status === 404) {
        errorMessage = 'Service not found';
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else {
        errorMessage = `HTTP error ${response.status}`;
      }
      
      console.error('❌ API error:', errorMessage);
      throw new Error(errorMessage);
    }
    
    console.log('✅ API call successful');
    return data;
    
  } catch (error) {
    console.error("❌ API error details:", error);
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      throw new Error("Could not connect to server. Please check your connection and make sure the server is running.");
    }
    
    // Handle timeout errors
    if (error.name === 'TypeError' && error.message.includes('timeout')) {
      throw new Error("Request timeout. Please try again.");
    }
    
    // Re-throw other errors with their original message
    throw error;
  }
};

// Test server connection
export const testConnection = async () => {
  try {
    console.log('🔍 Testing server connection...');
    const response = await callAPI('/', 'GET');
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Server connection test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Specific function for login
export const loginUser = async (email, password) => {
  try {
    console.log('🔐 Attempting user login...');
    const loginData = {
      email: email.toLowerCase().trim(),
      password: password.trim()
    };
    
    const response = await callAPI('/login', 'POST', loginData);
    console.log('✅ Login successful');
    return response;
  } catch (error) {
    console.error("❌ Login failed:", error.message);
    throw error; // Re-throw to let the calling component handle it
  }
};

// Specific function for user registration
export const registerUser = async (userData) => {
  try {
    console.log('👤 Attempting user registration...');
    const response = await callAPI('/register', 'POST', userData);
    console.log('✅ Registration successful');
    return response;
  } catch (error) {
    console.error("❌ Registration failed:", error.message);
    throw error;
  }
};

// Function to test database connection
export const testDatabase = async () => {
  try {
    console.log('🗄️ Testing database connection...');
    const response = await callAPI('/test-db', 'GET');
    console.log('✅ Database connection test successful:', response);
    return { success: true, data: response };
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return { success: false, error: error.message };
  }
};

// Add to your existing api.js
export const getBrands = () => callAPI('/brands/', 'GET');
export const getFeaturedBrands = () => callAPI('/brands/featured', 'GET');
export const getBrandProducts = (brandId) => callAPI(`/brands/${brandId}/products`, 'GET');