import {useEffect, useState} from 'react';
import axiosInstance from '@/components/axiosInstance/AxiosInstance';


export interface MediaFile {
    id: number;
    model_type: string;
    model_id: number;
    collection_name: string;
    type: string;
    file_path: string;
    gallery: null | string;
    mime_type: string;
    created_at: string;
    updated_at: string;
}
export interface CompanySetting {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    sales_phone: string;
    support_phone: string;
    optional_phone: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    website: string;
    sales_email: string;
    support_email: string;
    optional_email: string;
    telegram_channel: string;
    facebook_page: string;
    instagram_page: string;
    twitter_page: string;
    linkedin_page: string;
}
export interface PromotionSettings {
    enabled: boolean;
    banner: MediaFile | null;
    title: string;
    description: string;
    popup_delay: number;
    popup_expired_in: number;
}
export interface PaymentMethod {
    id: number;
    name: string;
    type: 'card' | 'mobile_money' | 'bank_transfer' | 'cash';
    provider: string;
    status: 'active' | 'inactive';
    instruction?: string;
    
    credentials?: any;
    endpoints?: any;
    additional_settings?: any;
    logo?: {
      id: number;
      file_path: string;
    };
    created_at: string;
    updated_at: string;
  }

export interface OTPSettings {
    // General Settings
    otp_enabled: boolean;
    otp_length: '4' | '6' | '8';
    otp_expiry_time: number;
    otp_resend_interval: number;
    otp_max_attempts: number;
  
    // Delivery Settings
    otp_via_email: boolean;
    otp_via_sms: boolean;
    otp_sms_provider: 'twilio' | 'nexmo' | 'messagebird';
    otp_email_provider: 'smtp' | 'sendgrid' | 'mailgun';
  
    // Security Settings
    otp_block_duration: number;
}
export interface MailConfigSettings {
    type: string;
    mail_host: string;
    mail_port: string;
    mail_username: string;
    mail_password: string;
    mail_encryption: string;
    mail_from_address: string;
    mail_from_name: string;
}

export interface SMTPSettings {
    type: string;
    mail_host: string;
    mail_port: string;
    mail_username: string;
    mail_password: string;
    mail_encryption: string;
    mail_from_address: string;
    mail_from_name: string;
}

export interface SeoSetting {
    id?: number;
    meta_title: string | null;
    meta_description: string | null;
    meta_tags: string | null;
    meta_canonical: string | null;
    meta_og_title: string | null;
    meta_og_description: string | null;
    created_at?: string;
    updated_at?: string;
    og_image: MediaFile | null;
}
export interface InvoiceSetting {
    id: number;
    invoice_note: string;
    footer_banner: MediaFile | null;
    header_banner: MediaFile | null;
    created_at: string;
    updated_at: string;
}

export interface GeneralSetting {
    id: number;
    title: string;
    subtitle: string;
    created_at: string;
    updated_at: string;
    logo: MediaFile | null;
    favicon: MediaFile | null;
    collapse_logo: MediaFile | null;
    dark_logo: MediaFile | null;
    banner: MediaFile | null;
}

export interface UtilitySettings {
    debugMode: boolean;
    lastCacheClear: string | null;
    lastLogClear: string | null;
}

export interface TermsAndConditionsSettings {
    title: string;
    content: string;
}

export interface PrivacyPolicySettings {
    title: string;
    content: string;
}

export interface RefundPolicySettings {
    title: string;
    content: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export const SettingAPi = {
    getSeoData: async () => {
        try {
            const response = await axiosInstance.get<ApiResponse<SeoSetting>>('/api/setting/seo');
            return response.data.data;
        } catch (error) {
            console.log('error in seo data', error);
            throw error;
        }
    },

    getGeneralSetting: async () => {
        try {
            const response = await axiosInstance.get<ApiResponse<GeneralSetting>>('/api/setting/general');
            return response.data.data;
        } catch (error) {
            console.log('error in general setting', error);
            throw error;
        }
    },

    getCompanySetting: async()=>{
        try {
            const response = await axiosInstance.get<ApiResponse<CompanySetting>>('/api/setting/company');
            return response.data.data;
        } catch (error) {
            console.log('error in company setting', error);
            throw error;
        }
    },

    getInvoiceSetting: async()=>{
        try {
            const response = await axiosInstance.get<ApiResponse<InvoiceSetting>>('/api/setting/invoice');
            return response.data.data;
        } catch (error) {
            console.log('error in get invoice setting', error);
            throw error;
        }
    },

    getMailConfig: async()=>{
        try {
            const response = await axiosInstance.get<ApiResponse<MailConfigSettings>>('/api/setting/mail-config');
            return response.data.data;
        } catch (error) {
            console.log('error in get mail config', error);
            throw error;
        }
    },

    getSMTPSettings: async()=>{
        try {
            const response = await axiosInstance.get<ApiResponse<SMTPSettings>>('/api/setting/smtp-config');
            return response.data.data;
        } catch (error) {
            console.log('error in get smtp settings', error);
            throw error;
        }
    },

    getUtilitySettings: async () => {
        try {
            const response = await axiosInstance.get<ApiResponse<UtilitySettings>>('/api/settings/utilities');
            return response.data.data;
        } catch (error) {
            console.log('error in get utility settings', error);
            throw error;
        }
    },

    getPromotionSettings: async()=>{
        try {
            const response = await axiosInstance.get<ApiResponse<PromotionSettings>>('/api/setting/promotion');
            return response.data.data;
        } catch (error) {
            console.log('error in get promotion settings', error);
            throw error;
        }
    },

    getOTPSettings: async()=>{
        try {
            const response = await axiosInstance.get<ApiResponse<OTPSettings>>('/api/setting/otp');     
            return response.data.data;
        } catch (error) {
            console.log('error in get otp settings', error);
            throw error;
        }
    },

    getTermsAndConditions: async (): Promise<ApiResponse<TermsAndConditionsSettings>> => {
        try {
            const response = await axiosInstance.get('/api/setting/term-and-condition');
            console.log('responsedsdsdsds', response.data.data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Error fetching terms and conditions:', error);
            return {
                success: false,
                data: { title: '', content: '' },
                message: (error as Error).message
            };
        }
    },

    getPrivacyPolicy: async (): Promise<ApiResponse<PrivacyPolicySettings>> => {
        try {
            const response = await axiosInstance.get('/api/setting/privacy-policy');
            console.log('responsedsdsdsds', response.data.data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Error fetching terms and conditions:', error);
            return {
                success: false,
                data: { title: '', content: '' },
                message: (error as Error).message
            };
        }
    },

    getRefundPolicy: async (): Promise<ApiResponse<RefundPolicySettings>> => {
        try {
            const response = await axiosInstance.get('/api/setting/refund-and-cancilation');
            console.log('responsedsdsdsds', response.data.data);
            return {
                success: true,
                data: response.data.data
            };
        } catch (error) {
            console.error('Error fetching terms and conditions:', error);
            return {
                success: false,
                data: { title: '', content: '' },
                message: (error as Error).message
            };
        }
    },
    getPaymentGateway: async()=>{
        try {
            const response = await axiosInstance.get('/api/payment-methods');
            return response.data;
        } catch (error) {   
            console.log('error in get payment gateway', error);
            throw error;
        }
    },
    getCurrency: async()=>{
        try{
            const response = await axiosInstance.get('/api/currency');
            return response.data;
        }catch(error){
            console.log('error in get currency', error);
            throw error;
        }
    }
};      