import React from "react";

interface AlertProps {
    message: string;
    type?: "error" | "success";
}

export const Alert = ({ message, type = "error" }: AlertProps) => {
    const styles =
        type === "error"
            ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-400"
            : "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/10 dark:border-emerald-900/20 dark:text-emerald-400";

    return (
        <div className={`p-4 rounded-md border text-sm ${styles}`}>
            {message}
        </div>
    );
};
