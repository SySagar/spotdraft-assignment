import axios, { type AxiosInstance } from "axios";

export const baseURL = import.meta.env.VITE_BASE_API as string;

export const APIInstance: AxiosInstance = axios.create({
  baseURL,
});

export const AuthorizedAPIInstance: AxiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

AuthorizedAPIInstance.interceptors.request.use((config) => {
  config.headers["Authorization"] =
    `Bearer ${localStorage.getItem("accessToken") ?? ""}`;
  return config;
});
