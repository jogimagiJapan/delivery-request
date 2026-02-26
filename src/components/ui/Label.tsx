import React from "react";

type LabelProps = {
    htmlFor: string;
    children: React.ReactNode;
    required?: boolean;
    sub?: React.ReactNode; // ラベル下の補足テキスト
    className?: string;
};

export function Label({ htmlFor, children, required, sub, className = "" }: LabelProps) {
    return (
        <div className={`mb-1.5 ${className}`}>
            <label
                htmlFor={htmlFor}
                className="flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: "var(--color-text-main)", fontFamily: "var(--font-main)" }}
            >
                {children}
                {required && (
                    <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--color-accent-rose)", color: "#fff" }}
                    >
                        必須
                    </span>
                )}
            </label>
            {sub && (
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-sub)" }}>
                    {sub}
                </p>
            )}
        </div>
    );
}
