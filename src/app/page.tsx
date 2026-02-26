import { Suspense } from "react";
import DeliveryForm from "@/components/form/DeliveryForm";

export default function HomePage() {
  return (
    <main
      className="min-h-dvh"
      style={{ background: "var(--color-base)" }}
    >
      {/* ヘッダー */}
      <header
        className="sticky top-0 z-10 px-4 py-4"
        style={{
          background: "rgba(253,253,251,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <p
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--color-accent-blue)", fontFamily: "var(--font-title)" }}
            >
              Delivery Request
            </p>
            <h1
              className="text-xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-title)", color: "var(--color-text-main)" }}
            >
              SEW THE SOUND
            </h1>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "var(--color-accent-blue)" }}
            aria-hidden="true"
          >
            STS
          </div>
        </div>
      </header>

      {/* フォーム本体 */}
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Suspense fallback={<div className="text-center py-10" style={{ color: "var(--color-text-sub)" }}>読み込み中...</div>}>
          <DeliveryForm />
        </Suspense>
      </div>
    </main>
  );
}
