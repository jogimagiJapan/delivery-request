"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { deliveryFormSchema, DeliveryFormSchema } from "@/lib/validations";
import { submitDeliveryForm } from "@/app/actions/submit";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ItemSelector } from "@/components/form/ItemSelector";
import { AddressSection } from "@/components/form/AddressSection";

type SubmitStatus = "idle" | "loading" | "debug" | "error";

// ---- セクション共通ラッパー ----
// Reactの再マウント（フォーカス喪失）を防ぐため、コンポーネントの外で定義する
const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <section
        className="rounded-2xl p-6 mb-4"
        style={{
            background: "var(--color-card)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--color-border)",
        }}
    >
        <h2
            className="text-xs font-bold uppercase tracking-widest mb-5 pb-3"
            style={{
                color: "var(--color-accent-blue)",
                fontFamily: "var(--font-title)",
                borderBottom: "2px solid var(--color-border)",
            }}
        >
            {title}
        </h2>
        {children}
    </section>
);

export default function DeliveryForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const authKey = searchParams.get("key") ?? "";

    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const today = new Date();
    const todayStr =
        today.getFullYear() +
        String(today.getMonth() + 1).padStart(2, "0") +
        String(today.getDate()).padStart(2, "0");

    const methods = useForm<DeliveryFormSchema>({
        resolver: zodResolver(deliveryFormSchema),
        defaultValues: {
            userDate: todayStr,
            userTime: "",
            userName: "",
            recipientName: "",
            recipientKana: "",
            phone: "",
            postalCode: "",
            prefecture: "",
            cityAddress: "",
            building: "",
            itemName: "",
            itemSize: "",
            itemColor: "",
            notes: "",
        },
        mode: "onSubmit",
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = async (data: DeliveryFormSchema) => {
        setSubmitStatus("loading");
        setErrorMessage("");

        const { userDate, userTime, userName, ...restData } = data;

        const payload = {
            ...restData,
            userId: `${userDate}_${userTime}_${userName}`,
            submittedAt: new Date().toISOString(),
        };

        try {
            const result = await submitDeliveryForm(payload);

            if (result.success) {
                router.push(`/complete?key=${authKey}`);
            } else if (result.isDebugMode) {
                setSubmitStatus("debug");
            } else {
                setSubmitStatus("error");
                setErrorMessage(result.error);
            }
        } catch (err) {
            console.error("Submission error:", err);
            setSubmitStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "サーバー通信中にエラーが発生しました。");
        }
    };

    // セクションラッパーは外で定義（行72〜100にあったものを削除）

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-2">
                {/* ── 識別情報 ── */}
                <Section title="Identification">
                    <div>
                        <Label
                            htmlFor="userDate"
                            required
                            sub="例：[20260226] _ [145235] _ [username]"
                        >
                            ユーザーID
                        </Label>
                        <div className="flex items-start gap-1.5 mt-2">
                            <div className="flex-[1.2]">
                                <Input
                                    id="userDate"
                                    type="text"
                                    placeholder="YYYYMMDD"
                                    maxLength={8}
                                    error={errors.userDate?.message}
                                    {...register("userDate")}
                                />
                            </div>
                            <span className="text-gray-400 font-bold shrink-0 mt-3.5">_</span>
                            <div className="flex-1">
                                <Input
                                    id="userTime"
                                    type="text"
                                    placeholder="HHMMSS"
                                    maxLength={6}
                                    error={errors.userTime?.message}
                                    {...register("userTime")}
                                />
                            </div>
                            <span className="text-gray-400 font-bold shrink-0 mt-3.5">_</span>
                            <div className="flex-[1.5]">
                                <Input
                                    id="userName"
                                    type="text"
                                    placeholder="名前（英数）"
                                    error={errors.userName?.message}
                                    {...register("userName")}
                                />
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── 受取人情報 ── */}
                <Section title="Recipient">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="recipientName" required>
                                氏名
                            </Label>
                            <Input
                                id="recipientName"
                                type="text"
                                placeholder="与儀 マギー"
                                error={errors.recipientName?.message}
                                {...register("recipientName")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="recipientKana">
                                <span>ふりがな</span>
                                <span
                                    className="text-xs ml-1"
                                    style={{ color: "var(--color-text-sub)" }}
                                >
                                    （ひらがな）
                                </span>
                            </Label>
                            <Input
                                id="recipientKana"
                                type="text"
                                placeholder="よぎ まぎー"
                                error={errors.recipientKana?.message}
                                {...register("recipientKana")}
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone" required sub="ハイフンなし10〜11桁">
                                電話番号
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                inputMode="numeric"
                                placeholder="09012345678"
                                maxLength={11}
                                error={errors.phone?.message}
                                {...register("phone")}
                            />
                        </div>
                    </div>
                </Section>

                {/* ── 配送先住所 ── */}
                <Section title="Shipping Address">
                    <AddressSection />
                </Section>

                {/* ── 商品情報 ── */}
                <Section title="Item">
                    <ItemSelector />
                </Section>

                {/* ── 備考 ── */}
                <Section title="Notes">
                    <div>
                        <Label htmlFor="notes">備考</Label>
                        <textarea
                            id="notes"
                            rows={3}
                            placeholder="特記事項があればご記入ください（任意）"
                            className="w-full px-4 py-3.5 rounded-xl border-2 text-base transition-all duration-200 outline-none resize-none"
                            style={{
                                borderColor: errors.notes
                                    ? "#f87171"
                                    : "var(--color-border)",
                                fontFamily: "var(--font-main)",
                                color: "var(--color-text-main)",
                                boxShadow: "var(--shadow-sm)",
                            }}
                            {...register("notes")}
                        />
                        {errors.notes && (
                            <p className="mt-1.5 text-xs text-red-500">
                                ⚠ {errors.notes.message}
                            </p>
                        )}
                    </div>
                </Section>

                {/* ── デバッグモード通知 ── */}
                {submitStatus === "debug" && (
                    <div
                        className="rounded-2xl p-5 animate-fade-in-up"
                        style={{ background: "#fff8e1", border: "2px solid #f59e0b" }}
                    >
                        <p className="font-semibold text-amber-700 mb-1">
                            🛠 環境設定待ち（GAS URL未設定）
                        </p>
                        <p className="text-sm text-amber-600">
                            送信内容はブラウザのコンソールに出力されています。
                            <br />
                            GASをデプロイ後、<code className="bg-amber-100 px-1 rounded">.env.local</code> の
                            <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_GAS_ENDPOINT</code> を更新してください。
                        </p>
                    </div>
                )}

                {/* ── エラー表示 ── */}
                {submitStatus === "error" && (
                    <div
                        className="rounded-2xl p-5 animate-fade-in-up"
                        style={{ background: "#fef2f2", border: "2px solid #fca5a5" }}
                    >
                        <p className="font-semibold text-red-700 mb-1">送信に失敗しました</p>
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    </div>
                )}

                {/* ── 送信ボタン ── */}
                <div className="pt-2 pb-8">
                    <Button
                        type="submit"
                        fullWidth
                        loading={submitStatus === "loading"}
                    >
                        {submitStatus === "loading" ? "送信中..." : "配送を申し込む"}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}
