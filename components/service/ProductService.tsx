// src/services/product.service.ts
import axiosInstance from '@/components/axiosInstance/AxiosInstance';

class ProductService {
  // Get all products across all stores
  // Get products for a specific store
  async getStoreProducts(storeId: string) {
    try {
      const response = await axiosInstance.get(`/api/store/${storeId}/products`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get single product details for a specific store
  async getSingleProduct(storeId: string, productId: string) {
    try {
      const response = await axiosInstance.get(`/api/store/${storeId}/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Search products
  async searchProducts(query: string) {
    try {
      const response = await axiosInstance.get('/api/products/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductService();