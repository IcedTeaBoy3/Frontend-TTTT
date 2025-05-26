import axiosInstance from "../config/axiosInstance";
export const createAppointment = async (data) => {
    try {
        const response = await axiosInstance.post(
            "/appointments/create-appointment",
            data,
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const getAllAppointments = async (page, limit) => {
    try {
        const response = await axiosInstance.get(`/appointments/get-all-appointments?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}