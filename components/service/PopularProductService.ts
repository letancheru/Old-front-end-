import axiosInstance from '@/components/axiosInstance/AxiosInstance';

export const getPopularProducts = async () => {
  const response = await axiosInstance.get('api/dashboard/popular-products');
  return response.data.data;
}; 