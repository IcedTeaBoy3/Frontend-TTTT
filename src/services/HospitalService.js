import axiosInstance from "../config/axiosInstance";

export const createHospital = async (data) => {
    try {
        const response = await axiosInstance.post(
            `/hospitals/create-hospital`,
            data,
        );
        return response.data;
    } catch (error) {
        console.error("Error creating hospital:", error);
        throw error;
    }
};
export const getAllHospitals = async (page, pageSize) => {
    try {
        const response = await axiosInstance.get(
            `/hospitals/get-all-hospitals`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all hospitals data:", error);
        throw error;
    }
};
export const updateHospital = async (id, data) => {
    try {
        const response = await axiosInstance.put(
            `/hospitals/update-hospital/${id}`,
            data,
        );
        return response.data;
    } catch (error) {
        console.error("Error updating hospital:", error);
        throw error;
    }
};
export const deleteHospital = async (id) => {
    try {
        const response = await axiosInstance.delete(
            `/hospitals/delete-hospital/${id}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting hospital:", error);
        throw error;
    }
};
export const deleteManyHospitals = async (ids) => {
    try {
        const response = await axiosInstance.post(
            `/hospitals/delete-all-hospitals`,
            ids,
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting hospitals:", error);
        throw error;
    }
};
