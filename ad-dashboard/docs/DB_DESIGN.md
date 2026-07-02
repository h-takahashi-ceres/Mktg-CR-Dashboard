# DB設計

広告運用ダッシュボードの最低限のテーブル設計。RDB（PostgreSQL想定）を前提とする。

## ER概要

```
Users ── (1:N) ─┐
                 ├─ Projects ── (1:N) ── MediaAccounts
Permissions      │
                 ├─ (1:N) ── Campaigns ── (1:N) ── AdSets ── (1:N) ── Ads ── (1:N) ── AdMetricsDaily
                 │
                 ├─ (1:N) ── Creatives ── (1:N) ── CreativeMetricsDaily
                 │
                 └─ (1:N) ── CreativeRequests ── (1:N) ── CreativeAssets
```

## テーブル定義

### Users
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| name | varchar | 氏名 |
| email | varchar unique | |
| password_hash | varchar | |
| role | enum(admin, operator, client) | 権限 |
| avatar_url | varchar null | |
| created_at / updated_at | timestamp | |

### Projects（案件）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| name | varchar | 案件名 |
| owner_id | uuid FK→Users | 担当者 |
| adtr | varchar | ADTR番号 |
| target_cpa | integer | 許容CPA |
| monthly_target_cost | integer | 月間目標Cost |
| monthly_target_cv | integer | 月間目標CV |
| status | enum(active, paused, completed) | |
| created_at / updated_at | timestamp | |

### MediaAccounts（広告アカウント紐付け）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK→Projects | |
| media | enum(Meta, TikTok, SmartNews, Popin, Taboola, Outbrain) | |
| account_id | varchar | 媒体側アカウントID |
| access_token | varchar (暗号化) | API連携トークン |
| status | enum(connected, error, disconnected) | |

### Campaigns / AdSets / Ads
| Campaigns | AdSets | Ads |
|---|---|---|
| id, project_id, media, external_id, name | id, campaign_id, external_id, name | id, ad_set_id, external_id, name, thumbnail_url |

いずれも `xxxMetricsDaily`（日次実績）を子テーブルとして持つ：

### AdMetricsDaily（共通の日次実績。Campaign/AdSet/Ad いずれの粒度でも同一構造）
| カラム | 型 |
|---|---|
| id | uuid PK |
| entity_type | enum(campaign, ad_set, ad) |
| entity_id | uuid |
| date | date |
| cost, imp, click, cv, mcv | integer |
| ctr, cvr, mcvr | numeric |
| cpc, cpm, cpa, mcpa, frequency | numeric |

> Looker Studio / BIツール向けに非正規化したビュー `v_daily_metrics` を用意し、
> project_name, owner_name 等を JOIN 済みで参照できるようにする。

### Creatives（クリエイティブ分析用マスタ）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK | |
| ad_id | uuid FK null | 配信中の広告と紐付け（任意） |
| media | enum | |
| name | varchar | |
| type | enum(image, video) | |
| size | varchar | 例: 1080x1080 |
| thumbnail_url | varchar | |
| owner_id | uuid FK→Users | |
| delivery_start / delivery_end | date | |

### CreativeMetricsDaily
Creatives の日次実績（cost, imp, click, cv, ctr, cvr, cpa, frequency）

### CreativeRequests（入稿依頼カンバン）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| project_id | uuid FK | |
| media | enum | |
| campaign_name / ad_set_name | varchar | 配信予定先（自由入力 or FK） |
| owner_id | uuid FK→Users | |
| requested_at | date | 依頼日 |
| desired_submit_date | date | 希望入稿日 |
| actual_submit_date | date null | 実際の入稿日 |
| daily_budget | integer | 日予算 |
| purpose | varchar | 目的 |
| note | text | 備考 |
| status | enum(未着手, 制作中, レビュー中, 入稿待ち, 完了) | |
| created_at / updated_at | timestamp | |

### CreativeAssets（入稿依頼に紐づく個別クリエイティブ）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| creative_request_id | uuid FK | |
| file_url | varchar | アップロード画像/動画 |
| file_type | enum(image, video) | |
| title, main_text, description, cta | varchar/text | |
| destination_url | varchar | 遷移URL |
| parameters | varchar | UTMパラメータ等 |
| size | varchar | |
| media | enum | |
| note | text | |

### Permissions（権限マトリクス。role×resourceで管理する場合）
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| role | enum(admin, operator, client) | |
| resource | varchar | 例: project.kpi, creative.request |
| can_view / can_edit | boolean | |

### Settings
| カラム | 型 | 説明 |
|---|---|---|
| id | uuid PK | |
| scope | enum(system, project) | |
| project_id | uuid null | scope=project の場合 |
| key / value | varchar / jsonb | 汎用設定値 |

## 権限とデータ閲覧範囲

| ロール | Projects | KPI | クリエイティブ分析 | 入稿依頼 | 権限・設定 |
|---|---|---|---|---|---|
| admin | 全件 閲覧/編集 | 全件 | 全件 | 全件 編集可 | 編集可 |
| operator | 担当案件のみ 閲覧/編集 | 担当案件のみ | 担当案件のみ | 担当案件のみ 編集可 | 閲覧不可 |
| client | 自社案件のみ 閲覧 | 自社案件のみ 閲覧 | 自社案件のみ 閲覧 | 自社案件のみ 閲覧（編集不可） | 閲覧不可 |

実装上は `project_id` に対する `ProjectMembers`（中間テーブル: project_id, user_id, role）を
別途持たせると、クライアントへの部分共有や複数担当者アサインにも柔軟に対応できる。
