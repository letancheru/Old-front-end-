import axios from 'axios';
import { toast } from 'react-hot-toast';
import Toast from '@/components/modules/custom/Toast';
import { Cart, CartResponse } from './CartService';

// Create a debug-specific axios instance
const debugAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor
debugAxiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      const branchId = localStorage.getItem('branch_id');
      if (branchId) {
        config.headers['X-Branch-Id'] = branchId;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor that doesn't redirect on auth errors
debugAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Just return the error response without redirecting
    return Promise.reject(error);
  }
);

interface DebugResponse<T> {
  error?: boolean;
  status?: number;
  message?: string;
  response?: T;
}

class DebugService {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api`;

  // Cart endpoints
  async getCart(): Promise<DebugResponse<Cart>> {
    try {
      const response = await debugAxiosInstance.get(`${this.baseUrl}/cart`);
      return {
        response: response.data.cart || response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async getSessionCart(): Promise<DebugResponse<Cart>> {
    try {
      const response = await debugAxiosInstance.get(`${this.baseUrl}/cart/session`);
      return {
        response: response.data.cart || response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async addToCart(productId: number, quantity: number): Promise<DebugResponse<CartResponse>> {
    try {
      const response = await debugAxiosInstance.post(`${this.baseUrl}/cart/items`, {
        product_stores_id: productId,
        quantity
      });
      return {
        response: response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async updateCartItem(itemId: number, quantity: number): Promise<DebugResponse<CartResponse>> {
    try {
      const response = await debugAxiosInstance.put(`${this.baseUrl}/cart/items/${itemId}`, {
        quantity
      });
      return {
        response: response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async removeCartItem(itemId: number): Promise<DebugResponse<CartResponse>> {
    try {
      const response = await debugAxiosInstance.delete(`${this.baseUrl}/cart/items/${itemId}`);
      return {
        response: response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async applyCoupon(cartId: string, code: string): Promise<DebugResponse<CartResponse>> {
    try {
      const response = await debugAxiosInstance.post(`${this.baseUrl}/cart/apply-coupon/${cartId}`, {
        coupon_code: code
      });
      return {
        response: response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async removeCoupon(cartId: string): Promise<DebugResponse<CartResponse>> {
    try {
      const response = await debugAxiosInstance.post(`${this.baseUrl}/cart/remove-coupon/${cartId}`);
      return {
        response: response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async validateCart(): Promise<DebugResponse<any>> {
    try {
      const response = await debugAxiosInstance.get(`${this.baseUrl}/cart/validate`);
      return {
        response: response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }

  async validateForCheckout(): Promise<DebugResponse<any>> {
    try {
      const response = await debugAxiosInstance.get(`${this.baseUrl}/cart/validate-for-checkout`);
      return {
        response: response.data
      };
    } catch (error: any) {
      return {
        error: true,
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        response: error.response?.data
      };
    }
  }
}

export default new DebugService(); 