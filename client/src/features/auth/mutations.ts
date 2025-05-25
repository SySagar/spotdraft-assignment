import { useMutation } from "@tanstack/react-query";
import { authAPI } from "./api";
import { toast } from "@/components/ui/custom-toast";
import { type LoginTypes, type RegisterTypes } from "./types";

export const useLoginMutation = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (data: LoginTypes) => authAPI.login(data),
    onSuccess: (data) => {
      toast({
        title: "",
        description: data?.message || "Login Successful",
        type: "success",
      });
      localStorage.setItem("accessToken", data?.token);
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Login failed",
        type: "error",
      });
    },
  });
};

export const useRegisterMutation = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (data: RegisterTypes) => authAPI.register(data),
    onSuccess: (data) => {
      toast({
        title: "User Created",
        description: data?.message || "Registration Successful",
        type: "success",
      });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Registration failed",
        type: "error",
      });
    },
  });
};
