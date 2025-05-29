import axiosInstance from "../config/axiosInstance";

export const getAllWorkingSchedules = async (page, pageSize) => {
    try {
        const response = await axiosInstance.get(`/working-schedules/get-all-working-schedules`);
        return response.data;
    } catch (error) {
        console.error("Error fetching working schedules:", error);
        throw error;
    }
}
export const createWorkingSchedule = async (data) => {
    try {
        const response = await axiosInstance.post(`/working-schedules/create-working-schedule`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating working schedule:", error);
        throw error;
    }
}
export const getWorkingScheduleByDoctor = async (doctorId) => {
    try {
        const response = await axiosInstance.get(`/working-schedules/get-working-schedule-by-doctor/${doctorId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching working schedule by doctor:", error);
        throw error;
    }
}
export const updateWorkingSchedule = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/working-schedules/update-working-schedule/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Error updating working schedule:", error);
        throw error;
    }
}
export const deleteWorkingSchedule = async (id) => {
    try {
        const response = await axiosInstance.delete(`/working-schedules/delete-working-schedule/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting working schedule:", error);
        throw error;
    }
}
export const deleteManyWorkingSchedules = async (ids) => {
    try {
        const response = await axiosInstance.post(`/working-schedules/delete-many-working-schedules`, { ids });
        return response.data;
    } catch (error) {
        console.error("Error deleting many working schedules:", error);
        throw error;
    }
}