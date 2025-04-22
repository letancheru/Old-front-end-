import axiosInstance from '@/components/axiosInstance/AxiosInstance';
import { toast } from 'react-hot-toast';



// User interface
export interface User {
  id: number;
  name: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;
  zone?: string;
  wereda?: string;
  kebele?: string;
  location?: string;
  country?: string;
  media?: Media[];
}

// Media interface
export interface Media {
  id: number;
  model_type: string;
  model_id: number;
  collection_name: string;
  type: string;
  file_path: string;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

// Profile data interface
export interface ProfileData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  zone: string;
  wereda: string;
  kebele: string;
  location: string;
  country: string;
  media: Media[];
}

// Password change interface
export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// Profile service class
class ProfileService {
  // Get user profile
  async getProfile(): Promise<User> {
    try {
      const response = await axiosInstance.get('/api/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(formData: FormData): Promise<any> {
    try {
      // Add _method field to simulate PUT request
      formData.append('_method', 'PUT');
      
      const response = await axiosInstance.post('/api/profile/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success("Profile updated successfully");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData: PasswordChangeData): Promise<any> {
    try {
      const response = await axiosInstance.put('/api/profile/change-password', passwordData);
      toast.success("Password changed successfully");
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      throw error;
    }
  }
}

export default new ProfileService();
