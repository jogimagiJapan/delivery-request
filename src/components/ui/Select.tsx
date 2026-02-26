import React, { forwardRef } from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    error?: string;
    placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ error, placeholder, children, className = "", ...props }, ref) => {
        return (
            <div>
                <div className="relative">
                    <select
                        ref={ref}
                        className={[
                            "w-full px-4 py-3.5 pr-10 rounded-xl text-base transition-all duration-200 appearance-none",
                            "border-2 outline-none cursor-pointer",
                            error
                                ? "border-red-400 bg-red-50"
                                : "border-[var(--color-border)] bg-white focus:border-[var(--color-accent-blue)]",
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
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {children}
                    </select>
                    {/* カスタム矢印 */}
                    <span
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-sub)]"
                        aria-hidden="true"
                    >
                        ▾
                    </span>
                </div>
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

Select.displayName = "Select";
