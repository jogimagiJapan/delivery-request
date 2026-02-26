"use client";

import { useFormContext } from "react-hook-form";
import { DeliveryFormSchema } from "@/lib/validations";
import { Label } from "@/components/ui/Label";
import { useRef } from "react";

export function UserIdInput() {
    const {
        register,
        formState: { errors },
    } = useFormContext<DeliveryFormSchema>();

    const timeRef = useRef<HTMLInputElement | null>(null);
    const nameRef = useRef<HTMLInputElement | null>(null);

    // エラーがある場合は枠線を赤くする
    const hasError = !!(errors.userDate || errors.userTime || errors.userName);

    return (
        <div>
            <Label
                htmlFor="userDate"
                required
                sub="例：[20260226] _ [145235] _ [username]"
            >
                ユーザーID
            </Label>

            {/* 統合された外枠 */}
            <div
                className={`mt-2 flex items-center px-1 py-1 rounded-xl border-2 transition-all duration-200 bg-white shadow-sm focus-within:border-[var(--color-accent-blue)] ${hasError ? "border-red-400 bg-red-50" : "border-[var(--color-border)]"
                    }`}
                style={{ minHeight: "52px" }}
                onClick={() => {
                    // 枠内をクリックした時、もし未入力なら最初のTimeにフォーカス
                    if (timeRef.current && !timeRef.current.value) {
                        timeRef.current.focus();
                    }
                }}
            >
                {/* Date (自動入力済・幅固定) */}
                <input
                    id="userDate"
                    type="text"
                    placeholder="YYYYMMDD"
                    maxLength={8}
                    className="border-none outline-none bg-transparent text-sm text-center"
                    style={{ width: "4.5rem", color: "var(--color-text-main)", fontFamily: "var(--font-main)" }}
                    {...register("userDate")}
                />

                <span className="text-gray-400 font-bold shrink-0 mx-0.5" style={{ transform: "translateY(-2px)" }}>_</span>

                {/* Time (オートタブ対応・幅固定) */}
                <input
                    type="text"
                    placeholder="HHMMSS"
                    maxLength={6}
                    className="border-none outline-none bg-transparent text-sm text-center"
                    style={{ width: "3.5rem", color: "var(--color-text-main)", fontFamily: "var(--font-main)" }}
                    {...register("userTime", {
                        onChange: (e) => {
                            // 6文字入力されたら自動で次の入力欄へ
                            if (e.target.value.length === 6 && nameRef.current) {
                                nameRef.current.focus();
                            }
                        }
                    })}
                    ref={(e) => {
                        register("userTime").ref(e);
                        timeRef.current = e;
                    }}
                />

                <span className="text-gray-400 font-bold shrink-0 mx-0.5" style={{ transform: "translateY(-2px)" }}>_</span>

                {/* Username (残りの幅をすべて使う) */}
                <input
                    type="text"
                    placeholder="名前（英数）"
                    className="border-none outline-none bg-transparent text-sm flex-1 px-1"
                    style={{ color: "var(--color-text-main)", fontFamily: "var(--font-main)" }}
                    {...register("userName")}
                    ref={(e) => {
                        register("userName").ref(e);
                        nameRef.current = e;
                    }}
                />
            </div>

            {/* エラー表示 */}
            {hasError && (
                <div className="mt-1.5 space-y-1">
                    {errors.userDate && <p className="text-xs text-red-500">⚠ Date: {errors.userDate.message}</p>}
                    {errors.userTime && <p className="text-xs text-red-500">⚠ Time: {errors.userTime.message}</p>}
                    {errors.userName && <p className="text-xs text-red-500">⚠ Name: {errors.userName.message}</p>}
                </div>
            )}
        </div>
    );
}
