"use client"

import { toast as sonnerToast, Toaster as SonnerToaster } from "sonner"
import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

type ToastType = "error" | "success" | "neutral"

type CustomToastProps = {
  title: string
  description?: string
  type?: ToastType
}

export function Toaster() {
  return (
    <SonnerToaster
      toastOptions={{
        classNames: {
          toast: "group toast group flex w-full items-center border-l-4 p-4 pr-6 gap-3",
          title: "text-sm font-semibold",
          description: "text-sm opacity-90",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted",
          error: cn("border-red-600 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-950 dark:text-red-300"),
          success: cn(
            "border-green-600 bg-green-50 text-green-800 dark:border-green-500 dark:bg-green-950 dark:text-green-300",
          ),
          info: cn(
            "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300",
          ),
        },
      }}
    />
  )
}

export function toast({ title, description, type = "neutral" }: CustomToastProps) {
  const getIcon = () => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500" />
      case "neutral":
      default:
        return <Info className="h-5 w-5 text-slate-600 dark:text-slate-400" />
    }
  }

  const toastType = type === "neutral" ? "info" : type

  return sonnerToast[toastType](
    <div className="flex flex-col gap-1">
      <div className="font-medium">{title}</div>
      {description && <div className="text-sm">{description}</div>}
    </div>,
    {
      icon: getIcon(),
    },
  )
}
