import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formikFieldError = (touched?: any, error?: any): string =>
  touched && error ? "border-red-500" : "";

export const formatDate = (dateObj: any) => {
  return format(dateObj, "dd/MM/yyyy");
};
