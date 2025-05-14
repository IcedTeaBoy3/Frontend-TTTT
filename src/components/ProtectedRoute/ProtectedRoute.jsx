import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roles }) => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
       return <Navigate to="/authentication" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};
export default ProtectedRoute;