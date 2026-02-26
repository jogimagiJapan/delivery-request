"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ITEM_MAP, ITEM_NAMES } from "@/data/items";
import { DeliveryFormSchema } from "@/lib/validations";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";

export function ItemSelector() {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<DeliveryFormSchema>();

    const selectedItem = watch("itemName");
    const selectedColor = watch("itemColor");
    const itemConfig = selectedItem ? ITEM_MAP[selectedItem] : null;

    // アイテム変更時の処理（サイズの自動入力と値リセット）
    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === "itemName" && type === "change") {
                const newItem = value.itemName;
                const config = newItem ? ITEM_MAP[newItem as string] : null;

                // カラーはリセット
                setValue("itemColor", "");

                // サイズの自動補完ロジック
                if (config && config.sizes.length === 1) {
                    setValue("itemSize", config.sizes[0]);
                } else {
                    setValue("itemSize", "");
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    return (
        <div className="space-y-4">
            {/* アイテム選択 */}
            <div>
                <Label htmlFor="itemName" required>
                    アイテム
                </Label>
                <Select
                    id="itemName"
                    placeholder="-- アイテムを選択 --"
                    error={errors.itemName?.message}
                    {...register("itemName")}
                >
                    {ITEM_NAMES.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </Select>
            </div>

            {/* サイズ選択（アイテム選択後に表示） */}
            <div style={{ display: itemConfig ? "block" : "none" }}>
                <Label htmlFor="itemSize" required>
                    サイズ
                </Label>
                {itemConfig && itemConfig.sizes.length === 1 ? (
                    // サイズが一つきり（F等）の場合はセレクトボックスではなくテキストと固定入力を表示
                    <div
                        className="w-full px-4 py-3.5 rounded-xl border-2"
                        style={{
                            borderColor: "var(--color-border)",
                            background: "#f0f4f8",
                            color: "var(--color-text-sub)",
                            fontFamily: "var(--font-main)",
                            boxShadow: "var(--shadow-sm)",
                            minHeight: "52px",
                        }}
                    >
                        {itemConfig.sizes[0]}
                        {/* フォーム送信用にhiddenをもたせる */}
                        <input type="hidden" value={itemConfig.sizes[0]} {...register("itemSize")} />
                    </div>
                ) : (
                    <Select
                        id="itemSize"
                        placeholder="-- サイズを選択 --"
                        error={errors.itemSize?.message}
                        {...register("itemSize")}
                    >
                        {itemConfig?.sizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </Select>
                )}
            </div>

            {/* カラー選択（hasColor=trueのアイテムのみ表示） */}
            <div style={{ display: itemConfig?.hasColor ? "block" : "none" }}>
                <Label htmlFor="itemColor" required>
                    カラー
                </Label>
                <div className="flex flex-wrap gap-2 mt-1">
                    {itemConfig?.colors.map((color) => {
                        const isSelected = selectedColor === color;
                        return (
                            <label
                                key={color}
                                className="cursor-pointer"
                                style={{ WebkitTapHighlightColor: "transparent" }}
                            >
                                {/* スクロールジャンプを防ぐための hidden input 代替クラス */}
                                <input
                                    type="radio"
                                    value={color}
                                    className="absolute opacity-0 w-0 h-0 appearance-none pointer-events-none"
                                    {...register("itemColor")}
                                />
                                <span
                                    className="inline-flex items-center justify-center px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-150 select-none"
                                    style={{
                                        minHeight: "52px",
                                        minWidth: "64px",
                                        // 選択中: アクセントブルー塗りつぶし
                                        background: isSelected
                                            ? "var(--color-accent-blue)"
                                            : "#fff",
                                        borderColor: isSelected
                                            ? "var(--color-accent-blue)"
                                            : "var(--color-border)",
                                        color: isSelected
                                            ? "#fff"
                                            : "var(--color-text-main)",
                                        boxShadow: isSelected
                                            ? "0 2px 8px rgba(93,138,168,0.30)"
                                            : "none",
                                    }}
                                >
                                    {color}
                                </span>
                            </label>
                        );
                    })}
                </div>
                {errors.itemColor && (
                    <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span>
                        {errors.itemColor.message}
                    </p>
                )}
            </div>

            {/* カラー選択不可の場合のインジケーター */}
            <div
                className="flex items-center gap-2 text-sm px-4 py-3 rounded-xl"
                style={{
                    background: "#f0f4f8",
                    color: "var(--color-text-sub)",
                    display: itemConfig && !itemConfig.hasColor ? "flex" : "none",
                }}
            >
                <span>ℹ</span>
                このアイテムはカラー選択不要です
            </div>
        </div>
    );
}
