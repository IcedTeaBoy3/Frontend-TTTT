import axiosInstance from "../api/axiosInstance";

export const createSpecialty = async (data) => {
    try {
        const response = await axiosInstance.post('/specialties/create-specialty', data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const getAllSpecialties = async () => {
    try {
        const response = await axiosInstance.get('/specialties/get-all-specialties');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const deleteSpecialty = async ({id}) => {
    try {
        const response = await axiosInstance.delete(`/specialties/delete-specialty/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const getSpecialty = async (id) => {
    try {
        const response = await axiosInstance.get(`/specialties/get-specialty/${id}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const updateSpecialty = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/specialties/update-specialty/${id}`, data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const deleteManySpecialties = async (ids) => {
    try {
        const response = await axiosInstance.post(`/specialties/delete-all-specialties`, ids);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}