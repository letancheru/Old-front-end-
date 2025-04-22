// src/services/auth.service.ts
import axiosInstance from '@/components/axiosInstance/AxiosInstance';
import { toast } from 'react-hot-toast';
import Toast from '@/components/modules/custom/Toast';

class AuthService {
  // Login user
  async login(email: string, password: string) {
    try {
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.custom(<Toast message="Login successful!" status="success" />);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.custom(<Toast message={message} status="error" />);
      throw error;
    }
  }

  // Register user
  async register(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) {
    try {
      const response = await axiosInstance.post('/api/auth/customer/register', userData);
      toast.custom(<Toast message="Registration successful!" status="success" />);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.custom(<Toast message={message} status="error" />);
      throw error;
    }
  }

  // Logout user
  logout() {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.custom(<Toast message="Logged out successfully" status="success" />);
    return true;
  }

  // Check if user is logged in
  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  // Get current user
  getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await axiosInstance.post('/api/auth/refresh');
      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      return access_token;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const response = await axiosInstance.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData: {
    name?: string;
    email?: string;
    phone?: string;
    avatar?: File;
  }) {
    try {
      const formData = new FormData();
      if (profileData.name) formData.append('name', profileData.name);
      if (profileData.email) formData.append('email', profileData.email);
      if (profileData.phone) formData.append('phone', profileData.phone);
      
      if(profileData.avatar) formData.append('avatar', profileData.avatar);

      const response = await axiosInstance.put('/api/auth/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.custom(<Toast message="Profile updated successfully" status="success" />);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.custom(<Toast message={message} status="error" />);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string) {
    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', { email });
      toast.custom(<Toast message="Password reset link sent to your email" status="success" />);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset link';
      toast.custom(<Toast message={message} status="error" />);
      throw error;
    }
  }

  // Reset password
  async resetPassword(resetData: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    try {
      const response = await axiosInstance.post('/api/auth/reset-password', resetData);
      toast.custom(<Toast message="Password reset successful" status="success" />);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.custom(<Toast message={message} status="error" />);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(code: string) {
    try {
      const response = await axiosInstance.post('/api/auth/verify-email', { code });
      toast.custom(<Toast message="Email verified successfully" status="success" />);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email verification failed';
      toast.custom(<Toast message={message} status="error" />);
      throw error;
    }
  }

  // Resend verification code
  async resendVerificationCode() {
    try {
      const response = await axiosInstance.post('/api/auth/resend-verification-code');
      toast.custom(<Toast message="Verification code resent" status="success" />);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend verification code';
      toast.custom(<Toast message={message} status="error" />);
      throw error;
    }
  }
}

export default new AuthService();