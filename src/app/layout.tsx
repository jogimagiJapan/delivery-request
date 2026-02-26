import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEW THE SOUND | 配送受付フォーム",
  description: "SEW THE SOUND イベント 配送申し込みフォーム",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
