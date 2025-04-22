import axiosInstance from '@/components/axiosInstance/AxiosInstance';

export const getMostRatedProducts = async () => {
  const response = await axiosInstance.get('api/dashboard/most-rated-products');
  return response.data;
};
