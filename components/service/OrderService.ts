import axiosInstance from "@/components/axiosInstance/AxiosInstance";
import axios from 'axios';

// Add debug logging
console.log("OrderService module is being loaded");

interface OrderParams {
    page?: number;
    search?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    per_page?: number;
}

export interface OrderResponse {
    current_page: number;
    data: Array<{
        id: number;
        order_number: string;
        total_amount: string;
        discount_amount: string;
        coupon_discount_amount: string;
        tax_amount: string;
        grand_total: string;
        order_status: string;
        payment_status: string;
        notes: string;
        created_at: string;
        user: {
            id: number;
            first_name: string;
            last_name:string;
            email: string;
            phone: string;
        };
        items: Array<{
            id: number;
            quantity: number;
            unit_price: string;
            subtotal: string;
            product_store: {
                product: {
                    id: number;
                    name: string;
                    SKU: string;
                };
            };
            productstore: {
                store: {
                    id: number;
                    name: string;
                    location: string;
                };
            };
        }>;
        payment: {
            id: number;
            status: string;
            reference: string;
        } | null;
    }>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
    invoice?: {
        id: number;
        invoice_number?: string;
        invoice_date?: string;
        due_date?: string;
        status?: string;
        // Add other invoice properties as needed
    };
}

export interface ReturnRequestResponse {
    current_page: number;
    data: Array<{
        id: number;
        return_reference: string;
        order: {
            id: number;
            order_number: string;
            user: {
                id: number;
                name: string;
                email: string;
                phone: string;
            };
        };
        status: string;
        reason: string;
        created_at: string;
        items: Array<{
            id: number;
            order_item_id: number;
            quantity: number;
            condition: string;
            reason: string;
            refund_amount: number;
            order_item: {
                product_store: {
                    product: {
                        name: string;
                        SKU: string;
                    };
                };
            };
        }>;
    }>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface ReturnRequestData {
    order_id: number;
    reason: string;
    items: Array<{
        order_item_id: number;
        quantity: number;
        condition: string;
        reason?: string;
    }>;
}

export interface ReturnApprovalData {
    return_id: number;
    admin_notes: string;
    restock_items: boolean;
    items: Array<{
        id: number;
        refund_amount: number;
    }>;
}

export interface ReturnRejectionData {
    return_id: number;
    admin_notes: string;
}

export const OrderService = {
    getAllOrders: async (params?: OrderParams): Promise<OrderResponse> => {
        try {
            console.log("OrderService.getAllOrders called with params:", params);
            console.log("axiosInstance available:", !!axiosInstance);
            
            if (!axiosInstance) {
                console.error("axiosInstance is not available in getAllOrders");
                throw new Error("API client not initialized");
            }
            
            const response = await axiosInstance.get('/api/user/orders', { params });
            console.log("OrderService.getAllOrders response:", response);
            return response.data;
        } catch (error) {
            console.error("Error in OrderService.getAllOrders:", error);
            throw error;
        }
    },
    
    getOrderById: async (id: string): Promise<OrderResponse> => {
        try {
            console.log('Fetching order with ID:', id);
            const response = await axiosInstance.get(`/api/orders/${id}`);
            console.log('Order service response:', response);
            return response.data;
        } catch (error) {
            console.error('Error in getOrderById:', error);
            throw error;
        }
    },

    // Return Request related functions
    getReturnRequests: async (params?: OrderParams): Promise<ReturnRequestResponse> => {
        try {
            const response = await axiosInstance.get('/api/return-requests', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    requestReturn: async (data: ReturnRequestData) => {
        try {
            const response = await axiosInstance.post('/api/return-requests', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    approveReturn: async (data: ReturnApprovalData) => {
        try {
            const response = await axiosInstance.post(`/api/return-requests/${data.return_id}/approve`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    rejectReturn: async (data: ReturnRejectionData) => {
        try {
            const response = await axiosInstance.post(`/api/return-requests/${data.return_id}/reject`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    downloadInvoice: async (orderId: number) => {
        try {
            // First create the invoice if it doesn't exist
            await axios.post(`/api/invoices/orders/${orderId}`);
            
            // Then download it
            const response = await axios.get(`/api/invoices/${orderId}/download`, {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
    
    // New methods for invoice handling
    generateInvoice: async (orderId: number) => {
        try {
            const response = await axiosInstance.post(`/api/invoices/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('Error generating invoice:', error);
            throw error;
        }
    },

    getInvoiceViewUrl: (invoiceId: number) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${invoiceId}`;
    },

    getInvoicePrintUrl: (invoiceId: number) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${invoiceId}?print=true`;
    },

    getInvoiceDownloadUrl: (invoiceId: number) => {
        return `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${invoiceId}/download`;
    }
};

// Add debug logging at the end of the file
console.log("OrderService object created:", OrderService);
console.log("OrderService.getAllOrders available:", typeof OrderService.getAllOrders === 'function');