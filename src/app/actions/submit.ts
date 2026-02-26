"use server";

import { SubmitPayload } from "@/types/form";

const GAS_ENDPOINT = process.env.NEXT_PUBLIC_GAS_ENDPOINT ?? "";
const IS_PLACEHOLDER =
    !GAS_ENDPOINT || GAS_ENDPOINT.includes("YOUR_SCRIPT_ID");

export type SubmitResult =
    | { success: true }
    | { success: false; error: string; isDebugMode?: boolean };

export async function submitDeliveryForm(
    payload: SubmitPayload
): Promise<SubmitResult> {
    // GAS URL 未設定時のデバッグモード
    if (IS_PLACEHOLDER) {
        console.log(
            "=== [DEBUG MODE] GAS URL未設定 - 送信内容 ===\n",
            JSON.stringify(payload, null, 2)
        );
        // デバッグ用に成功を模倣（1秒遅延でローディング表示も確認可能）
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
            success: false,
            error: "GAS_NOT_CONFIGURED",
            isDebugMode: true,
        };
    }

    try {
        const res = await fetch(GAS_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error(`HTTP error: ${res.status}`);
        }

        const data = await res.json();
        if (data.result === "success") {
            return { success: true };
        } else {
            throw new Error(data.message ?? "GASからエラーレスポンスが返されました");
        }
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "予期しないエラーが発生しました";
        return { success: false, error: message };
    }
}
