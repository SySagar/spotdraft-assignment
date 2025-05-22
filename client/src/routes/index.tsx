import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from '@/layout/AppLayout';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Dashboard from '@/pages/dashboard';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            { path: '/dashboard', element: <Dashboard /> },
        ]
    },
    { path: '/login', element: <Login /> },
    { path: '/signup', element: <Signup /> },
    { path: '/share/:token', element: <div>Public PDF View</div> }
]);

export default function Routes() {
    return <RouterProvider router={router} />;
}
