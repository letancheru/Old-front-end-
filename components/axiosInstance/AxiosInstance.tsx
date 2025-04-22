// src/lib/axiosInstance.ts
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Toast from '@/components/modules/custom/Toast';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Only attempt to get token on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add branch ID if available
      const branchId = localStorage.getItem('branch_id');
      if (branchId) {
        config.headers['X-Branch-Id'] = branchId;
      }
    }
    
    // Log request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful response for debugging
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    if (typeof window !== 'undefined') {
      // Log error details for debugging
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle unauthorized errors
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        toast.custom(<Toast message="Session expired. Please login again." status="error" />);
      }

      // Handle other common errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        const message = error.response?.data?.message || 'An error occurred';
        toast.custom(<Toast message={message} status="error" />);
      }

      // Handle server errors
      if (error.response?.status >= 500) {
        toast.custom(<Toast message="Server error. Please try again later." status="error" />);
      }

      // Handle network errors
      if (!error.response) {
        toast.custom(<Toast message="Network error. Please check your connection." status="error" />);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;