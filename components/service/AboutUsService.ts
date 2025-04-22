import axiosInstance from "@/components/axiosInstance/AxiosInstance";

interface AboutUs {
    id: number;
    title: string;
    description: string;
    image: string;
}

export const aboutUsService = {
    getAboutUs: async () => {
        const response = await axiosInstance.get('/api/about-us');
        return response.data;
    },
    getAboutUsById: async (id: number) => {
        const response = await axiosInstance.get(`/api/about-us/${id}`);
        return response.data;
    }
}