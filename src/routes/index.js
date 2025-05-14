import HomePage from "../pages/HomePage/HomePage"
import AuthenticationPage from "../pages/AuthenticationPage/AuthenticationPage"
import AdminPage from "../pages/AdminPage/AdminPage"
import UnauthorizedPage from "../pages/UnauthorizedPage/UnauthorizedPage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage"
export const routes = [
    {
        path: '/',
        page: HomePage,
        public: true,
    },
    {
        path: '/authentication',
        page: AuthenticationPage,
        public: true,
    },
    {
        path: '/admin',
        page: AdminPage,
        roles: ['admin'],

    },
    {
        path: '/unauthorized',
        page: UnauthorizedPage,
        public: true,
    },
    {
        path: '*',
        page:NotFoundPage,
        public: true,
    }
]