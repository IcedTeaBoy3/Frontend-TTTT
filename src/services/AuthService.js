import axiosInstance from "../config/axiosInstance";

export const registerUser = async (data) => {
    try {
        const response = await axiosInstance.post(`/auth/register`, data);
        return response.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
};
export const loginUser = async (data) => {
    try {
        const response = await axiosInstance.post(`/auth/login`, data);
        return response.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
};
export const logoutUser = async () => {
    try {
        const response = await axiosInstance.post(`/auth/logout`, {});
        return response.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
};
export const refreshToken = async () => {
    try {
        const response = await axiosInstance.post(`/auth/refresh-token`, {});
        return response.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
};
export const verifyEmail = async (token) => {
    try {
        const response = await axiosInstance.get(`/auth/verify-email`, {
            params: { token }
        });
        return response.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
}
