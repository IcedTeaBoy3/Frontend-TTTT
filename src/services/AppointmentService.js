import axiosInstance from "../config/axiosInstance";
export const createAppointment = async (data) => {
    try {
        const response = await axiosInstance.post( "/appointments/create-appointment",data,);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const getAllAppointments = async (page, limit) => {
    try {
        const response = await axiosInstance.get(`/appointments/get-all-appointments`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const deleteAppointment = async (id) => {
    try {
        const response = await axiosInstance.delete(`/appointments/delete-appointment/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const updateAppointment = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/appointments/update-appointment/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const deleteManyAppointments = async (ids) => {
    try {
        const response = await axiosInstance.post("/appointments/delete-many-appointments", { ids });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const getAllAppointmentsByPatient = async (patientId,page, pageSize) => {
    try {
        const response = await axiosInstance.get(`/appointments/get-all-appointments-by-patient/${patientId}?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const cancelAppointment = async (id) => {
    try {
        const response = await axiosInstance.put(`/appointments/cancel-appointment/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const confirmAppointment = async (id) => {
    try {
        const response = await axiosInstance.put(`/appointments/confirm-appointment/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const completeAppointment = async (id) => {
    try {
        const response = await axiosInstance.put(`/appointments/complete-appointment/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const getAllAppointmentsByDoctor = async (doctorId, page, pageSize) => {
    try {
        const response = await axiosInstance.get(`/appointments/get-all-appointments-by-doctor/${doctorId}?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}