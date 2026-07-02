# AdOps Hub - 広告運用ダッシュボード

広告代理店向けの「広告運用ダッシュボード」。運用担当者が毎朝最初に開く画面として、
KPI確認・クリエイティブ分析・クリエイティブ入稿依頼までを1つの画面で完結できるようにした
Next.js（App Router）プロジェクトです。

現段階ではモックデータで動作するフロントエンドのみのプロジェクトです（API/DBは未接続）。
`docs/` 以下にDB設計・API設計・Looker Studio再現構成をまとめています。

## 主な画面

| メニュー | パス | 内容 |
|---|---|---|
| チーム全体KPI進捗 | `/dashboard/team` | KPIカード、案件一覧、日別Cost推移、改善が必要な案件 |
| 案件KPI進捗 | `/dashboard/project` | 案件・期間選択、キャンペーン/広告セット/広告の3タブ |
| クリエイティブ分析 | `/dashboard/creatives` | 各種ランキング、媒体/静止画動画/サイズ別比較、画像一覧＋詳細モーダル |
| クリエイティブ入稿依頼 | `/dashboard/creative-requests` | Kanban形式の依頼管理（ドラッグ&ドロップ対応） |
| 権限・設定 | `/dashboard/settings` | 案件登録、権限管理、媒体連携ステータス |

## 技術スタック

- Next.js 15（App Router） / TypeScript
- TailwindCSS + shadcn/ui相当のコンポーネント（Radix UIベースで自前実装）
- Recharts（グラフ）
- Lucide Icons

## セットアップ

```bash
npm install
npm run dev
```

`http://localhost:3000` にアクセスするとルートが `/dashboard/team` にリダイレクトされます。

## ビルド

```bash
npm run build
npm run start
```

## Vercelへのデプロイ

1. 本リポジトリをGitHubにpush
2. Vercelで「Import Project」からこのリポジトリを選択
3. Framework Presetは自動で `Next.js` が検出されます（追加設定不要）
4. そのままデプロイ可能です

## ディレクトリ構成

```
app/                  App Router のページ
  dashboard/
    team/              チーム全体KPI進捗
    project/           案件KPI進捗
    creatives/         クリエイティブ分析
    creative-requests/ クリエイティブ入稿依頼（Kanban）
    settings/          権限・設定
components/
  layout/             サイドバー・トップバー
  ui/                 shadcn/ui相当の基本コンポーネント
  dashboard/          KPIカード・グラフ・アラートカード等
  creatives/          クリエイティブカード・詳細モーダル
  kanban/             Kanbanボード・カード・詳細ダイアログ
lib/
  types.ts            ドメイン型定義（DB設計と対応）
  mock-data.ts         モックデータ生成
  utils.ts            共通ユーティリティ
docs/
  DB_DESIGN.md         DB設計
  API_DESIGN.md        REST API設計
  LOOKER_STUDIO.md      Looker Studioでの再現方法
```

## 今後の実装（React + Next.js本実装時）

- `lib/mock-data.ts` を `docs/API_DESIGN.md` のエンドポイントへの `fetch` に置き換え
- 認証（NextAuth等）とロールベースのアクセス制御（middleware.ts）を追加
- 画像/動画アップロードは署名付きURL方式（S3 / GCSなど）を想定
- 媒体API（Meta, TikTok, SmartNews, Popin, Taboola, Outbrain）からのデータ取り込みバッチを
  Cloud Scheduler等で日次実行し、`docs/DB_DESIGN.md` のテーブルにUPSERT

## 注意事項

- 本プロジェクトはネットワーク遮断環境で作成されているため、`npm install` /
  `npm run build` の実機検証は行えていません。依存バージョンは2025年後半〜2026年前半時点の
  Next.js 15 / React 19系に合わせていますが、デプロイ前に一度ローカルまたはVercelの
  プレビュー環境でのビルド確認を推奨します。
