import axiosInstance from "../config/axiosInstance";

const StaticService = {
    // 1. Thống kê tổng quan (dashboard)
    getAppointmentStats: async (startDate, endDate) => {
        try {
            const response = await axiosInstance.get('/static/appointment-stats', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê tổng quan.');
        }
    },
    getDoctorOverviewStats: async (startDate, endDate) => {
        try {
            const response = await axiosInstance.get('/static/stats/doctor/overview', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê bác sĩ.');
        }
    },
    getDoctorStatsBySpecialty: async (startDate, endDate) => {
        try {
            const response = await axiosInstance.get('/static/stats/doctor/by-specialty', {
                params: { startDate, endDate }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê bác sĩ theo chuyên khoa.');
        }
    },
    getAppointmentTrend: async (data) => {
        try {
            const { startDate, endDate, groupBy = 'day' } = data;
            const response = await axiosInstance.get('/static/appointment-trend', {
                params: { startDate, endDate, groupBy }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê lịch hẹn.');
        }
    },
    getPatientOverviewStats: async () => {
        try {
            const response = await axiosInstance.get('/static/stats/patient/overview');
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Lỗi khi lấy dữ liệu thống kê bệnh nhân.');
        }
    }
};
export default StaticService;