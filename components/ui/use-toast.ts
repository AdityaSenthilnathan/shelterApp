import { toast as sonnerToast } from "sonner"

export type ToastVariant = "default" | "destructive"

interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
}

export function toast({ title, description, variant = "default" }: ToastOptions) {
  sonnerToast(title, {
    description,
    className:
      variant === "destructive"
        ? "bg-red-600 text-white"
        : "bg-white text-black",
  })
}
