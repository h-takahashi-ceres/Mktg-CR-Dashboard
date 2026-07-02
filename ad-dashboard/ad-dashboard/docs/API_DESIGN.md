# API設計（REST）

すべて `Authorization: Bearer <token>` を前提。ロール（admin / operator / client）に応じて
サーバー側でレスポンスの対象案件をフィルタする。

## ダッシュボード

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/dashboard/team` | チーム全体KPIサマリー + 案件一覧 + 日別Cost推移 |
| GET | `/api/dashboard/project/:projectId` | 指定案件のKPI（`?period=`, `?from=&to=` 対応） |
| GET | `/api/dashboard/project/:projectId/campaigns` | キャンペーン一覧・サマリー |
| GET | `/api/dashboard/project/:projectId/ad-sets` | 広告セット一覧・サマリー（`?campaignId=`） |
| GET | `/api/dashboard/project/:projectId/ads` | 広告一覧・CPAランキング（`?adSetId=`） |

## クリエイティブ分析

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/creatives` | 検索・ランキング取得（`?projectId=&media=&ownerId=&from=&to=&q=&sort=`） |
| GET | `/api/creatives/:id` | クリエイティブ詳細（日別推移含む） |
| GET | `/api/creatives/compare/media` | 媒体別比較 |
| GET | `/api/creatives/compare/type` | 静止画・動画比較 |
| GET | `/api/creatives/compare/size` | サイズ別比較 |

## クリエイティブ入稿依頼（カンバン）

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/creative-requests` | 一覧取得（カンバン表示用、ステータス別） |
| GET | `/api/creative-requests/:id` | 詳細取得（基本情報 + 登録済みクリエイティブ） |
| POST | `/api/creative-requests` | 新規依頼作成 |
| PATCH | `/api/creative-requests/:id` | 依頼の更新（ステータス変更含む） |
| DELETE | `/api/creative-requests/:id` | 依頼削除 |
| POST | `/api/creative-requests/:id/assets` | クリエイティブアセット追加 |
| PATCH | `/api/creative-requests/:id/assets/:assetId` | アセット更新 |
| DELETE | `/api/creative-requests/:id/assets/:assetId` | アセット削除 |
| POST | `/api/uploads` | 画像/動画アップロード（署名付きURL発行） |

## 案件・設定

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/projects` | 案件一覧 |
| POST | `/api/projects` | 案件登録（名称・担当者・広告アカウント・ADTR・許容CPA・目標Cost/CV） |
| GET | `/api/projects/:id` | 案件詳細 |
| PATCH | `/api/projects/:id` | 案件更新 |
| DELETE | `/api/projects/:id` | 案件削除（アーカイブ推奨） |
| GET | `/api/projects/:id/media-accounts` | 紐づく広告アカウント一覧 |
| POST | `/api/projects/:id/media-accounts` | 広告アカウント紐付け追加 |

## ユーザー・権限

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/users` | ユーザー一覧 |
| POST | `/api/users` | ユーザー招待 |
| PATCH | `/api/users/:id/role` | 権限（role）変更 |
| GET | `/api/permissions` | ロール×リソースの権限マトリクス取得 |
| PATCH | `/api/permissions` | 権限マトリクス更新 |

## 媒体連携

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/media-connections` | 媒体別API連携ステータス |
| POST | `/api/media-connections/:media/connect` | OAuth連携開始 |
| POST | `/api/media-connections/:media/sync` | 手動データ同期トリガー |

## レスポンス例

```json
GET /api/dashboard/team

{
  "summary": {
    "totalCost": 12500000,
    "totalCv": 2650,
    "avgCpa": 4717,
    "overCpaCount": 2,
    "activeProjectCount": 6,
    "yesterdayCost": 410000,
    "yesterdayCv": 88,
    "yesterdayCpa": 4659
  },
  "projects": [
    {
      "projectId": "p1",
      "projectName": "ABCコスメ 新規獲得キャンペーン",
      "ownerName": "佐藤 花子",
      "targetCost": 3000000,
      "actualCost": 2100000,
      "consumptionRate": 70.0,
      "forecastCost": 3150000,
      "cv": 480,
      "cpa": 4375,
      "targetCpa": 4500,
      "isOverCpa": false
    }
  ],
  "dailyCost": [{ "date": "2026-06-03", "cost": 405000 }]
}
```

```json
PATCH /api/creative-requests/req-3
{
  "status": "レビュー中"
}
```

## 認証・バッチ

| Method | Path | 説明 |
|---|---|---|
| POST | `/api/auth/login` | ログイン |
| POST | `/api/auth/logout` | ログアウト |
| POST | `/api/batch/sync-media` | 媒体APIからの日次データ取り込みバッチ（Cronトリガー） |

各媒体（Meta / TikTok / SmartNews / Popin / Taboola / Outbrain）のAPIから
日次でCost/IMP/CLICK/CVなどを取得し、`AdMetricsDaily` / `CreativeMetricsDaily` に
UPSERTするバッチジョブを想定（Cloud Scheduler 等で1日数回実行）。
