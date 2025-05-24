import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authAPI } from "@/features/auth/api";
import { useUserStore } from "@/store/userStore";

const ProtectedRoute = () => {
  const [isVerified, setIsVerified] = useState<null | boolean>(null);
  const setUser = useUserStore((state) => state.setUser);

  const verifyToken = useCallback(async () => {
    try {
      const res = await authAPI.verify();
      setIsVerified(true);
      if (res)
        setUser(res?.data)
    } catch {
      setIsVerified(false);
    }
  }, [setIsVerified])


  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    console.log('token')

    if (!token) {
      setIsVerified(false);
      return;
    }

    verifyToken();
  }, []);

  if (isVerified === null) {
    return <div className="p-4">🔐 Verifying authentication...</div>; // Optional spinner
  }

  if (!isVerified) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
