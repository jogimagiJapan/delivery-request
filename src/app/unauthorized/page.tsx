export default function UnauthorizedPage() {
    return (
        <main
            className="min-h-dvh flex flex-col items-center justify-center px-4"
            style={{ background: "var(--color-base)" }}
        >
            <div
                className="w-full max-w-md rounded-3xl p-8 text-center"
                style={{
                    background: "var(--color-card)",
                    boxShadow: "var(--shadow-lg)",
                    border: "1px solid var(--color-border)",
                }}
            >
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl"
                    style={{ background: "#fef2f2" }}
                >
                    🔒
                </div>
                <h1
                    className="text-xl font-bold mb-3"
                    style={{ fontFamily: "var(--font-title)", color: "var(--color-text-main)" }}
                >
                    Access Denied
                </h1>
                <p className="text-sm" style={{ color: "var(--color-text-sub)" }}>
                    このフォームを表示するには認証キーが必要です。
                    <br />
                    スタッフからお知らせしたURLにアクセスしてください。
                </p>
            </div>
        </main>
    );
}
