import axiosInstance from "../api/axiosInstance";

export const getUser = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/get-user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}