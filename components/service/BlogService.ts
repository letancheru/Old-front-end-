import axiosInstance from "@/components/axiosInstance/AxiosInstance";

interface MediaFile {
  id: number;
  model_type: string;
  model_id: number;
  collection_name: string;
  type: string;
  file_path: string | null;
  gallery: string | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  description: string;
  details: string;
  created_at: string;
  updated_at: string;
  banner: MediaFile;
  gallery: MediaFile;
}

export const blogService = {
  getBlogs: async () => {
    const response = await axiosInstance.get('/api/blogs');
    return response.data;
  },
  getBlogById: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/api/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }
};

