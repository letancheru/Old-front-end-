import axiosInstance from '@/components/axiosInstance/AxiosInstance';

interface MediaFile {
  id: number;
  model_type: string;
  model_id: number;
  collection_name: string;
  type: string;
  file_path: string;
  gallery: null;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

export interface Partner {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  logo: MediaFile;
  media: MediaFile[];
}

type ApiResponse = Partner[];

export const partnerService = {
  getAllPartners: async (): Promise<Partner[]> => {
    try {
      const response = await axiosInstance.get<ApiResponse>('/api/partners');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching partners:', error);
      throw error;
    }
  }
};
