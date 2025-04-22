import axiosInstance from '@/components/axiosInstance/AxiosInstance';

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  description: string;
  instructions?: string;
  is_active: boolean;
  icon?: string;
  logo?: {
    file_path: string;
  };
  requires_verification: boolean;
}

class PaymentMethodService {
  // Get all payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await axiosInstance.get('/api/payment-methods');
    return response.data.data || response.data || [];
  }
}

export default new PaymentMethodService(); 