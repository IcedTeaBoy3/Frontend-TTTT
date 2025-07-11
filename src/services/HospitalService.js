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
export const getAllHospitals = async (type, status, page, pageSize,specialty,searchValue) => {
    try {
        const response = await axiosInstance.get(
            `/hospitals/get-all-hospitals`,
            {
                params: {
                    type: type,
                    status: status,
                    page: page,
                    limit: pageSize,
                    searchValue: searchValue,
                    specialty: specialty
                }
            }
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
export const searchHospital = async (keyword, specialty, page, limit) => {
    try {
        
        const response = await axiosInstance.get(
            `/hospitals/search-hospital?keyword=${keyword}&specialty=${specialty}&page=${page}&limit=${limit}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error searching hospital:", error);
        throw error;
    }
}
export const getHospital = async (id) => {
    try {
        const response = await axiosInstance.get(
            `/hospitals/get-hospital/${id}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching hospital data:", error);
        throw error;
    }
}
export const getAllDoctorsHospital = async (id,status) => {
    try {
        const response = await axiosInstance.get(
            `/hospitals/get-all-doctors-hospital/${id}?status=${status}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all doctors in hospital:", error);
        throw error;
    }
}