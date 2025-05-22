import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formikFieldError = (
  touched?: any,
  error?: any,
): string => (touched && error ? 'border-red-500' : '');
