import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { authAPI } from "@/features/auth/api";

const ProtectedRoute = () => {
  const [isVerified, setIsVerified] = useState<null | boolean>(null);

  const verifyToken = useCallback(async () => {
    try {
      await authAPI.verify();
      setIsVerified(true);
    } catch {
      setIsVerified(false);
    }
  }, [setIsVerified])


  useEffect(() => {
    const token = localStorage.getItem("accessToken");

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
