import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AdOps Hub | 広告運用ダッシュボード",
  description: "広告代理店向け 広告運用ダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
