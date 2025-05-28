import { CircleX } from "lucide-react";
import { toast } from "sonner";

interface ToastOptions {
    description?: string;
    duration?: number;
}

const baseToastStyle = {
    color: "var(--popover-foreground)",
    border: "var(--border)",
    fontSize: "14px",
    fontWeight: "500",
    boxShadow: "var(--shadow)",
    padding: "1rem",
    gap: "0.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
};

const actionButtonStyle = {
    backgroundColor: "transparent",
    color: "slate-100",
    borderColor: "transparent"
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
    toast(message, {
        description: options?.description,
        descriptionClassName: "text-sm text-slate-800 font-semibold",
        duration: options?.duration || 3000,
        action: {
            label: <CircleX className="h-4 w-4" />,
            onClick: () => toast.dismiss()
        },
        actionButtonStyle,
        style: {
            ...baseToastStyle,
            backgroundColor: "#22BB33",
        }
    });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
    toast(message, {
        description: options?.description,
        descriptionClassName: "text-sm text-slate-800 font-semibold",
        duration: options?.duration || 3000,
        action: {
            label: <CircleX className="h-4 w-4" />,
            onClick: () => toast.dismiss()
        },
        actionButtonStyle,
        style: {
            ...baseToastStyle,
            backgroundColor: "#FF3333",
        }
    });
};