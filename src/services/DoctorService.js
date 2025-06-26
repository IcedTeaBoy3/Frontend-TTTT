import axiosInstance from "../config/axiosInstance";

export const createDoctor = async (data) => {
    try {
        const response = await axiosInstance.post("/doctors/create-doctor",data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const getAllDoctors = async (isHospitalNotNull, page, pageSize, specialty,qualification,searchValue) => {
    try {
        const response = await axiosInstance.get(`/doctors/get-all-doctors`,
            {
                params: {
                    isHospitalNotNull: isHospitalNotNull,
                    specialty: specialty,
                    qualification: qualification,
                    searchValue: searchValue,
                    page: page,
                    limit: pageSize
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const updateDoctor = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/doctors/update-doctor/${id}`,data,);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const getDoctor = async (id) => {
    try {
        const response = await axiosInstance.get(`/doctors/get-doctor/${id}`,);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const deleteDoctor = async (id) => {
    try {
        const response = await axiosInstance.delete(`/doctors/delete-doctor/${id}`,);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const deleteManyDoctors = async (ids) => {
    try {
        const response = await axiosInstance.post(`/doctors/delete-many-doctors`,{ids});
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const searchDoctors = async (keyword, specialty,page,limit) => {
    try {
        const response = await axiosInstance.get(`/doctors/search-doctors?keyword=${keyword}&specialty=${specialty}&page=${page}&limit=${limit}`,);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}
export const getDoctorByUserId = async () => {
    try {
        const response = await axiosInstance.get(`/doctors/get-doctor-by-userId`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
export const getDoctorStatistics = async (doctorId,startDate,endDate) => {
    try {
        const response = await axiosInstance.get(`/doctors/${doctorId}/statistics?from=${startDate}&to=${endDate}`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};