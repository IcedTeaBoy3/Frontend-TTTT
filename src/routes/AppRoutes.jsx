import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import AuthenticationPage from "../pages/AuthenticationPage/AuthenticationPage";
import UnauthorizedPage from "../pages/UnauthorizedPage/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import { useSelector } from "react-redux";
// Các trang con trong admin
import Dashboard from "../pages/AdminPage/Dashboard";
import Appointment from "../pages/AdminPage/Appointment";
import Doctor from "../pages/AdminPage/Doctor";
import Patient from "../pages/AdminPage/Patient";
import Hospital from "../pages/AdminPage/Hospital";
import Specialty from "../pages/AdminPage/Specialty";

const AppRoutes = () => {
    // Giả lập user
    const user = useSelector((state) => state.auth.user);

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/authentication" element={<AuthenticationPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    user?.role === "admin" ? (
                        <AdminLayout />
                    ) : (
                        <Navigate to="/unauthorized" />
                    )
                }
            >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="appointments" element={<Appointment />} />
                <Route path="doctors" element={<Doctor />} />
                <Route path="patients" element={<Patient />} />
                <Route path="hospitals" element={<Hospital />} />
                <Route path="specilties" element={<Specialty />} />
                {/* Các route con khác */}
                <Route index element={<Navigate to="dashboard" />} />
            </Route>

            {/* Route không khớp */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
