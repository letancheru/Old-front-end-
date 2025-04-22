import axiosInstance from '@/components/axiosInstance/AxiosInstance';

export const getBestSellingProducts = async () => {
  const response = await axiosInstance.get('api/dashboard/popular-products');
  return response.data.data;
};

