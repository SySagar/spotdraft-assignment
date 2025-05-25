import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "@/layout/AppLayout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import SharePdfPage from "@/pages/share/[token]";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unathorized";
import ProtectedRoute from "@/common/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "users", element: <UsersPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/share/:token", element: <SharePdfPage /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { path: "*", element: <NotFound /> },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
