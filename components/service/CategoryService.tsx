import axiosInstance from "@/components/axiosInstance/AxiosInstance";

const CategoryService = {
    getCategories: async () => {
        const response = await axiosInstance.get("api/categories");
        return response.data;
    }
}

export default CategoryService;