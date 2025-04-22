import axiosInstance from '@/components/axiosInstance/AxiosInstance';

export interface MediaFile {
  id: number;
  model_type: string;
  model_id: number;
  collection_name: string;
  type: string;
  file_path: string;
  gallery: string | null;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  thumbnail: MediaFile;
  discount_type?: 'percent' | 'fixed';
  discount?: string;
}

export interface ProductStore {
  id: number;
  price: string;
  quantity: number;
  product: Product;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_stores_id: string;
  quantity: number;
  coupon_discount: string;
  price: string;
  discount: string;
  tax_rate: string;
  tax_amount: string;
  subtotal: string;
  total: string;
  created_at: string;
  updated_at: string;
  product_store: {
    id: number;
    product_id: number;
    store_id: number;
    quantity: number;
    price: string;
    created_at: string;
    updated_at: string;
    product: {
      id: number;
      category_id: number;
      brand_id: number;
      unit_id: number;
      name: string;
      slug: string;
      description: string;
      details: string;
      youtube_link: string | null;
      SKU: string;
      code: string;
      min_deliverable_qty: number;
      max_deliverable_qty: number | null;
      discount_type: 'percent' | 'fixed';
      discount: string;
      status: number;
      created_at: string;
      updated_at: string;
      thumbnail: MediaFile;
      taxes: Array<{
        id: number;
        name: string;
        code: string;
        default_tax_rate: number;
        status: string;
        is_active: boolean;
        created_at: string;
        updated_at: string;
        pivot: {
          product_id: number;
          tax_id: number;
          custom_tax_rate: string;
        };
      }>;
    };
  };
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: string;
  discount_amount: string;
  tax_amount: string;
  grand_total: string;
  coupon_discount_amount: string;
  coupon_code: string | null;
  created_at: string;
  updated_at: string;
  checkout_started_at: string | null;
  checkout_token: string | null;
  deleted_at: string | null;
}

export interface CartResponse {
  message?: string;
  data: Cart;
}

export interface CheckoutPreview {
  items: CartItem[];
  subtotal: number;
  total: number;
  shipping_fee: number;
  tax: number;
  discount: number;
}

export interface CheckoutProcess {
  shipping_address: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  billing_address: {
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  payment_method_id: string;
  notes?: string;
}

export interface Coupon {
  id: number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase?: number;
  max_discount?: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit?: number;
  usage_count: number;
}

class CartService {
  // Get cart items
  async getCart(): Promise<Cart> {
    const response = await axiosInstance.get('/api/cart');
    return response.data;
  }

  // Add item to cart
  async addItem(productStoreId: string, quantity: number): Promise<Cart> {
    const response = await axiosInstance.post('/api/cart/items', {
      product_stores_id: productStoreId,
      quantity
    });
    return response.data;
  }

  // Update cart item
  async updateItem(itemId: string, quantity: number): Promise<Cart> {
    try {
      console.log(`Updating cart item ${itemId} with quantity ${quantity}`);
      const response = await axiosInstance.put(`/api/cart/items/${itemId}`, { 
        quantity,
       
      });
      console.log("Update cart response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  }

  // Remove item from cart
  async removeItem(itemId: string): Promise<Cart> {
    const response = await axiosInstance.delete(`/api/cart/items/${itemId}`);
    return response.data;
  }

  // Clear cart
  async clearCart(): Promise<Cart> {
    const response = await axiosInstance.delete('/api/cart');
    return response.data;
  }

  // Get session cart
  async getSessionCart(): Promise<Cart> {
    const response = await axiosInstance.get('/api/cart/session');
    return response.data;
  }

  // Apply coupon
  async applyCoupon(cartId: string, couponCode: string): Promise<Cart> {
    const response = await axiosInstance.post(`/api/cart/apply-coupon/${cartId}`, {
      coupon_code: couponCode
    });
    return response.data;
  }

  // Remove coupon
  async removeCoupon(cartId: string): Promise<Cart> {
    const response = await axiosInstance.post(`/api/cart/remove-coupon/${cartId}`);
    return response.data;
  }

  // Validate cart
  async validateCart(): Promise<Cart> {
    const response = await axiosInstance.get('/api/cart/validate');
    return response.data;
  }

  // Validate cart for checkout
  async validateForCheckout(): Promise<Cart> {
    const response = await axiosInstance.get('/api/cart/validate-for-checkout');
    return response.data;
  }

  // Process checkout
  async processCheckout(checkoutData: CheckoutProcess): Promise<any> {
    const response = await axiosInstance.post('/api/checkout/process', checkoutData);
    return response.data;
  }

  // Get checkout preview
  async getCheckoutPreview(): Promise<CheckoutPreview> {
    const response = await axiosInstance.get('/api/checkout/preview');
    return response.data;
  }

  // Validate coupon
  async validateCoupon(code: string): Promise<{ valid: boolean; message: string; coupon?: Coupon }> {
    const response = await axiosInstance.post('/api/coupons/validate', { code });
    return response.data;
  }

  // Get coupon details
  async getCouponDetails(code: string): Promise<Coupon> {
    const response = await axiosInstance.get(`/api/coupons/${code}`);
    return response.data;
  }
}

export default new CartService(); 