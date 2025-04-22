import axiosInstance from "@/components/axiosInstance/AxiosInstance";

export const BrandService = {
    getBrands: async () => {
        const response = await axiosInstance.get("api/brands");
        return response.data;
    },
    getBrandById: async (id: string) => {
        const response = await axiosInstance.get(`/brands/${id}`);
        return response.data;
    }
}

