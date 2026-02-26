import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    suffix?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ error, suffix, className = "", ...props }, ref) => {
        return (
            <div className="relative">
                <input
                    ref={ref}
                    className={[
                        "w-full px-4 py-3.5 rounded-xl text-base transition-all duration-200",
                        "border-2 outline-none",
                        error
                            ? "border-red-400 bg-red-50"
                            : "border-[var(--color-border)] bg-white focus:border-[var(--color-accent-blue)]",
                        suffix ? "pr-16" : "",
                        className,
                    ]
                        .filter(Boolean)
                        .join(" ")}
                    style={{
                        color: "var(--color-text-main)",
                        fontFamily: "var(--font-main)",
                        boxShadow: "var(--shadow-sm)",
                        minHeight: "52px",
                    }}
                    {...props}
                />
                {suffix && (
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium"
                        style={{ color: "var(--color-text-sub)" }}
                    >
                        {suffix}
                    </span>
                )}
                {error && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
