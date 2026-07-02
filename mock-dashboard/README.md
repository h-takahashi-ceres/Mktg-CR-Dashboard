# AdOps Hub（モックUI版）

広告代理店向け広告運用ダッシュボードの**最小構成モックUI**です。
複雑なライブラリ（TypeScript / Radix UI / Recharts等）を使わず、
Next.js + React + TailwindCSSのみで構成しています。静的なモックデータを表示するだけの画面です。

## 技術構成（最小限）

- Next.js 14（App Router） / JavaScript（TypeScriptなし）
- TailwindCSS
- 外部UIライブラリ・チャートライブラリ・状態管理ライブラリは使用していません

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` にアクセスすると `/dashboard/team` にリダイレクトされます。

## ビルド

```bash
npm run build
npm run start
```

## Vercelへのデプロイ

1. 本リポジトリの中身（`package.json` がある階層）をGitHubリポジトリの**直下**にpush
2. Vercelで「Import Project」からこのリポジトリを選択（Root Directoryは空欄のままでOK）
3. Framework Presetは自動で `Next.js` が検出されます
4. そのままデプロイ可能です

## 画面一覧

| メニュー | パス |
|---|---|
| チーム全体KPI進捗 | `/dashboard/team` |
| 案件KPI進捗 | `/dashboard/project` |
| クリエイティブ分析 | `/dashboard/creatives` |
| クリエイティブ入稿依頼 | `/dashboard/creative-requests` |
| 権限・設定 | `/dashboard/settings` |

## 注意事項

- すべて `lib/mock-data.js` の静的データを表示しているだけで、実際のAPI通信は行っていません。
- 型チェック・複雑な状態管理・ドラッグ&ドロップ等は含めていません（クリエイティブ入稿依頼はカラム表示のみ）。
