import axiosInstance from "../config/axiosInstance";

export const getUser = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/get-user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
export const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get(`/users/get-all-users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all users data:", error);
        throw error;
    }
};
export const deleteUser = async ({ id }) => {
    try {
        const response = await axiosInstance.delete(`/users/delete-user/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
export const updateUser = async (id, data) => {
    try {
        const response = await axiosInstance.put(
            `/users/update-user/${id}`,
            data,
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
export const deleteManyUsers = async (ids) => {
    try {
        const response = await axiosInstance.post(
            `/users/delete-all-users`,
            ids,
        );
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
export const insertManyUsers = async (users) => {
    try {
        const response = await axiosInstance.post(
            `/users/insert-many-users`,
            users,
        );
        return response.data;
    } catch (error) {
        console.error("Error inserting many users:", error);
        throw error;
    }
}
export const uploadAvatar = async (id, formData) => {
    try {
        const response = await axiosInstance.post(`/users/upload-avatar/${id}`,formData);
        return response.data;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
}