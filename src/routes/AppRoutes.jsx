import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import AuthenticationPage from "../pages/AuthenticationPage/AuthenticationPage";
import UnauthorizedPage from "../pages/UnauthorizedPage/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import DetailDoctorPage from "../pages/DetailDoctorPage/DetailDoctorPage";
import BookingPage from "../pages/BookingPage/BookingPage";
import BookingSuccess from "../pages/BookingSuccess/BookingSuccess";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import SearchPage from "../pages/SearchPage/SearchPage";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
// Các trang con trong admin
import Dashboard from "../pages/AdminPage/Dashboard";
import Appointment from "../pages/AdminPage/Appointment";
import Doctor from "../pages/AdminPage/Doctor";
import Patient from "../pages/AdminPage/Patient";
import Hospital from "../pages/AdminPage/Hospital";
import Specialty from "../pages/AdminPage/Specialty";
import WorkingSchedule from "../pages/AdminPage/WorkingSchedule";
const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/authentication" element={<AuthenticationPage />} />
                <Route path="/detail-doctor/:id" element={<DetailDoctorPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/booking" element={
                    <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}>
                        <BookingPage />
                    </ProtectedRoute>
                } />
                <Route path="/booking-success" element={
                    <ProtectedRoute allowedRoles={["patient", "doctor", "admin"]}>
                        <BookingSuccess />
                    </ProtectedRoute>
                } />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="appointments" element={<Appointment />} />
                    <Route path="doctors" element={<Doctor />} />
                    <Route path="patients" element={<Patient />} />
                    <Route path="hospitals" element={<Hospital />} />
                    <Route path="specilties" element={<Specialty />} />
                    <Route path="doctor-schedules" element={<WorkingSchedule />} />
                    {/* Các route con khác */}
                    <Route index element={<Navigate to="dashboard" />} />
                </Route>

                {/* Route không khớp */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
