import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '@/layout/AppLayout';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Dashboard from '@/pages/dashboard'
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unathorized';
import ProtectedRoute from '@/common/ProtectedRoute';

const router = createBrowserRouter([
    {
        path: '/',
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [{ path: "dashboard", element: <Dashboard /> }],
            },
        ]
    },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: "/unauthorized", element: <Unauthorized /> },
    { path: '/share/:token', element: <div>Public PDF View</div> },
    { path: "*", element: <NotFound /> },
]);

export default function Routes() {
    return <RouterProvider router={router} />;
}
