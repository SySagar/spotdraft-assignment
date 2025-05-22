import { APIInstance, AuthorizedAPIInstance } from "@/lib/axios";
import { type RegisterTypes, type LoginTypes } from "./types";

export const authAPI = {
    register: async (data: RegisterTypes) => {
        const response = await APIInstance.post("/auth/signup", data);
        return response.data;
    },

    login: async (data: LoginTypes) => {
        const response = await APIInstance.post("/auth/login", data);
        return response.data;
    },

    verify: async () => {
        return await AuthorizedAPIInstance.get("/auth/verify");
    }
};