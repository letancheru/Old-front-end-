import axiosInstance from "@/components/axiosInstance/AxiosInstance";

const ShopsService = {
    getShops: async () => {
        const response = await axiosInstance.get("api/stores");
        return response.data;
    }
}

export default ShopsService;