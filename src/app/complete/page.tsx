"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Suspense } from "react";

function CompleteContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const authKey = searchParams.get("key") ?? "event_2026";

    return (
        <main
            className="min-h-dvh flex flex-col items-center justify-center px-4"
            style={{ background: "var(--color-base)" }}
        >
            <div
                className="w-full max-w-md rounded-3xl p-8 text-center animate-fade-in-up"
                style={{
                    background: "var(--color-card)",
                    boxShadow: "var(--shadow-lg)",
                    border: "1px solid var(--color-border)",
                }}
            >
                {/* アイコン */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"
                    style={{ background: "linear-gradient(135deg, #e8f4ea 0%, #c8e6c9 100%)" }}
                >
                    ✓
                </div>

                <h1
                    className="text-2xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-title)", color: "var(--color-text-main)" }}
                >
                    送信完了
                </h1>
                <p className="mb-1" style={{ color: "var(--color-text-sub)" }}>
                    配送申し込みを受け付けました。
                </p>
                <p className="text-sm mb-8" style={{ color: "var(--color-text-sub)" }}>
                    ご登録のアイテムを準備してお待ちください。
                </p>

                <Button
                    variant="primary"
                    fullWidth
                    onClick={() => router.push(`/?key=${authKey}`)}
                >
                    新規で入力する
                </Button>
            </div>
        </main>
    );
}

export default function CompletePage() {
    return (
        <Suspense fallback={null}>
            <CompleteContent />
        </Suspense>
    );
}
