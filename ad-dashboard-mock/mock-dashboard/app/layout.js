import "./globals.css";

export const metadata = {
  title: "AdOps Hub | 広告運用ダッシュボード（モック）",
  description: "広告代理店向け 広告運用ダッシュボード モックUI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
