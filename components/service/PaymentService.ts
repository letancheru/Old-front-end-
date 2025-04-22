import axiosInstance from '@/components/axiosInstance/AxiosInstance';

export interface PaymentInitialization {
  authorization_url?: string;
  reference?: string;
  status: string;
  message: string;
}

export interface PaymentVerification {
  status: string;
  message: string;
  transaction_id?: string;
  payment_status?: string;
}

class PaymentService {
  private baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/payments`;

  // Upload payment receipt
  async uploadReceipt(orderId: number, receiptFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('receipt', receiptFile);

    const response = await axiosInstance.post(`${this.baseUrl}/${orderId}/upload-receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Verify bank transfer
  async verifyBankTransfer(orderId: number, reference: string): Promise<PaymentVerification> {
    const response = await axiosInstance.post(`${this.baseUrl}/${orderId}/verify-bank-transfer`, {
      reference
    });
    return response.data;
  }

  // Handle gateway callback
  async handleGatewayCallback(orderId: number, transactionData: any): Promise<PaymentVerification> {
    const response = await axiosInstance.post(`${this.baseUrl}/${orderId}/handle-gateway-callback`, transactionData);
    return response.data;
  }

  // Initialize payment
  async initializePayment(orderId: number, paymentMethod: string): Promise<PaymentInitialization> {
    const response = await axiosInstance.post(`${this.baseUrl}/${orderId}/initialize-payment`, {
      payment_method: paymentMethod
    });
    return response.data;
  }
}

export default new PaymentService(); 