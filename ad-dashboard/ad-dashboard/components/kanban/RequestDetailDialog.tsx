"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { CreativeAsset, CreativeRequest } from "@/lib/types";

let assetSeq = 1000;

function emptyAsset(media: CreativeRequest["media"]): CreativeAsset {
  assetSeq += 1;
  return {
    id: `asset-new-${assetSeq}`,
    fileName: "",
    fileType: "image",
    title: "",
    mainText: "",
    description: "",
    cta: "",
    destinationUrl: "",
    parameters: "",
    size: "",
    media,
    note: "",
  };
}

export function RequestDetailDialog({
  request,
  open,
  onOpenChange,
}: {
  request: CreativeRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [assets, setAssets] = useState<CreativeAsset[]>([]);

  useEffect(() => {
    if (request) setAssets(request.assets);
  }, [request]);

  if (!request) return null;

  const updateAsset = (id: string, patch: Partial<CreativeAsset>) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{request.projectName}</DialogTitle>
            <Badge variant="outline">{request.status}</Badge>
          </div>
          <DialogDescription>
            {request.campaignName} ／ {request.adSetName}
          </DialogDescription>
        </DialogHeader>

        {/* 基本情報 */}
        <section className="mb-6">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">基本情報</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 rounded-lg border border-border p-4 text-sm sm:grid-cols-3">
            <InfoRow label="媒体" value={request.media} />
            <InfoRow label="担当者" value={request.ownerName} />
            <InfoRow label="依頼日" value={request.requestedAt} />
            <InfoRow label="希望入稿日" value={request.desiredSubmitDate} />
            <InfoRow label="実際の入稿日" value={request.actualSubmitDate ?? "未入稿"} />
            <InfoRow label="日予算" value={formatCurrency(request.dailyBudget)} />
            <InfoRow label="目的" value={request.purpose} full />
            <InfoRow label="備考" value={request.note} full />
          </div>
        </section>

        {/* クリエイティブ登録 */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground">
              クリエイティブ登録（{assets.length}件）
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAssets((prev) => [...prev, emptyAsset(request.media)])}
            >
              <Plus className="h-3.5 w-3.5" />
              クリエイティブを追加
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {assets.length === 0 && (
              <p className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                登録されたクリエイティブはまだありません。「クリエイティブを追加」から登録してください。
              </p>
            )}
            {assets.map((asset, idx) => (
              <div key={asset.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold">クリエイティブ #{idx + 1}</p>
                  <button
                    onClick={() => setAssets((prev) => prev.filter((a) => a.id !== asset.id))}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mb-3 flex items-center gap-2 rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
                  <UploadCloud className="h-4 w-4" />
                  画像または動画をアップロード（ファイル名: {asset.fileName || "未選択"}）
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="タイトル">
                    <Input
                      value={asset.title}
                      onChange={(e) => updateAsset(asset.id, { title: e.target.value })}
                    />
                  </Field>
                  <Field label="CTA">
                    <Input
                      value={asset.cta}
                      onChange={(e) => updateAsset(asset.id, { cta: e.target.value })}
                    />
                  </Field>
                  <Field label="メインテキスト" full>
                    <Input
                      value={asset.mainText}
                      onChange={(e) => updateAsset(asset.id, { mainText: e.target.value })}
                    />
                  </Field>
                  <Field label="説明文" full>
                    <Input
                      value={asset.description}
                      onChange={(e) => updateAsset(asset.id, { description: e.target.value })}
                    />
                  </Field>
                  <Field label="遷移URL">
                    <Input
                      value={asset.destinationUrl}
                      onChange={(e) => updateAsset(asset.id, { destinationUrl: e.target.value })}
                    />
                  </Field>
                  <Field label="パラメータ">
                    <Input
                      value={asset.parameters}
                      onChange={(e) => updateAsset(asset.id, { parameters: e.target.value })}
                    />
                  </Field>
                  <Field label="画像サイズ">
                    <Input
                      placeholder="1080x1080"
                      value={asset.size}
                      onChange={(e) => updateAsset(asset.id, { size: e.target.value })}
                    />
                  </Field>
                  <Field label="備考">
                    <Input
                      value={asset.note}
                      onChange={(e) => updateAsset(asset.id, { note: e.target.value })}
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              閉じる
            </Button>
            <Button onClick={() => onOpenChange(false)}>保存する</Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-full" : undefined}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? "sm:col-span-2" : undefined}>
      <p className="mb-1 text-[11px] text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
