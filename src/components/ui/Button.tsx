import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
    loading?: boolean;
    fullWidth?: boolean;
};

export function Button({
    variant = "primary",
    loading = false,
    fullWidth = false,
    disabled,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]";

    const variantStyles = {
        primary: [
            "text-white px-6 py-4 text-base",
            "focus-visible:ring-[var(--color-accent-blue)]",
            "disabled:opacity-60 disabled:cursor-not-allowed",
        ].join(" "),
        secondary: [
            "px-6 py-4 text-base border-2",
            "border-[var(--color-border)] bg-white text-[var(--color-text-main)]",
            "hover:border-[var(--color-accent-blue)] hover:text-[var(--color-accent-blue)]",
            "focus-visible:ring-[var(--color-accent-blue)]",
        ].join(" "),
        ghost: [
            "px-4 py-3 text-sm",
            "text-[var(--color-text-sub)] hover:text-[var(--color-text-main)]",
            "focus-visible:ring-[var(--color-accent-blue)]",
        ].join(" "),
    };

    return (
        <button
            className={[
                base,
                variantStyles[variant],
                fullWidth ? "w-full" : "",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            disabled={disabled || loading}
            style={
                variant === "primary"
                    ? {
                        background:
                            "linear-gradient(135deg, var(--color-accent-blue) 0%, #4a7a9b 100%)",
                        boxShadow: "0 4px 14px rgba(93, 138, 168, 0.35)",
                        fontFamily: "var(--font-main)",
                        minHeight: "56px",
                    }
                    : { fontFamily: "var(--font-main)", minHeight: "56px" }
            }
            {...props}
        >
            {loading && (
                <span
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                    aria-hidden="true"
                />
            )}
            {children}
        </button>
    );
}
