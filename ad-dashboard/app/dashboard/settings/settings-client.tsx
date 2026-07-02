"use client";

import { useState } from "react";
import { Plus, ShieldCheck, Link2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { projects as initialProjects, users as initialUsers } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import type { MediaType, Project, Role, User } from "@/lib/types";

const MEDIA_OPTIONS: MediaType[] = [
  "Meta",
  "TikTok",
  "SmartNews",
  "Popin",
  "Taboola",
  "Outbrain",
];

const ROLE_LABEL: Record<Role, string> = {
  admin: "管理者",
  operator: "運用者",
  client: "クライアント",
};

const ROLE_SCOPE: Record<Role, string> = {
  admin: "全案件・全機能を閲覧・編集可能（権限・設定を含む）",
  operator: "担当案件のKPI・クリエイティブ分析・入稿依頼を閲覧・編集可能",
  client: "自社案件のKPI・クリエイティブ分析のみ閲覧可能（編集不可）",
};

export function SettingsClient() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const [form, setForm] = useState({
    name: "",
    ownerId: users[1]?.id ?? "",
    mediaAccounts: [] as MediaType[],
    adtr: "",
    targetCpa: "",
    monthlyTargetCost: "",
    monthlyTargetCv: "",
  });

  const toggleMedia = (m: MediaType) => {
    setForm((f) => ({
      ...f,
      mediaAccounts: f.mediaAccounts.includes(m)
        ? f.mediaAccounts.filter((x) => x !== m)
        : [...f.mediaAccounts, m],
    }));
  };

  const addProject = () => {
    if (!form.name) return;
    const owner = users.find((u) => u.id === form.ownerId);
    const newProject: Project = {
      id: `p-new-${Date.now()}`,
      name: form.name,
      ownerId: form.ownerId,
      ownerName: owner?.name ?? "",
      mediaAccounts: form.mediaAccounts,
      adtr: form.adtr,
      targetCpa: Number(form.targetCpa) || 0,
      monthlyTargetCost: Number(form.monthlyTargetCost) || 0,
      monthlyTargetCv: Number(form.monthlyTargetCv) || 0,
      status: "active",
    };
    setProjects((prev) => [newProject, ...prev]);
    setForm({
      name: "",
      ownerId: users[1]?.id ?? "",
      mediaAccounts: [],
      adtr: "",
      targetCpa: "",
      monthlyTargetCost: "",
      monthlyTargetCv: "",
    });
  };

  const updateRole = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  };

  return (
    <Tabs defaultValue="projects">
      <TabsList>
        <TabsTrigger value="projects">案件登録</TabsTrigger>
        <TabsTrigger value="permissions">権限管理</TabsTrigger>
        <TabsTrigger value="media">媒体連携</TabsTrigger>
      </TabsList>

      {/* 案件登録 */}
      <TabsContent value="projects" className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">新規案件登録</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">案件名</p>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="例）ABCコスメ 新規獲得キャンペーン"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">担当者</p>
                <Select
                  value={form.ownerId}
                  onValueChange={(v) => setForm((f) => ({ ...f, ownerId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((u) => u.role !== "client")
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">ADTR</p>
                <Input
                  value={form.adtr}
                  onChange={(e) => setForm((f) => ({ ...f, adtr: e.target.value }))}
                  placeholder="ADTR-00000"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">許容CPA</p>
                <Input
                  type="number"
                  value={form.targetCpa}
                  onChange={(e) => setForm((f) => ({ ...f, targetCpa: e.target.value }))}
                  placeholder="4500"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">月間目標Cost</p>
                <Input
                  type="number"
                  value={form.monthlyTargetCost}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, monthlyTargetCost: e.target.value }))
                  }
                  placeholder="3000000"
                />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">月間目標CV</p>
                <Input
                  type="number"
                  value={form.monthlyTargetCv}
                  onChange={(e) => setForm((f) => ({ ...f, monthlyTargetCv: e.target.value }))}
                  placeholder="650"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <p className="mb-1 text-xs text-muted-foreground">広告アカウント（連携媒体）</p>
                <div className="flex flex-wrap gap-2">
                  {MEDIA_OPTIONS.map((m) => (
                    <button
                      key={m}
                      onClick={() => toggleMedia(m)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                        form.mediaAccounts.includes(m)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button className="mt-4" onClick={addProject}>
              <Plus className="h-4 w-4" />
              案件を登録する
            </Button>
          </CardContent>
        </Card>

        <div>
          <p className="mb-3 text-sm font-semibold">登録済み案件一覧</p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>案件名</TableHead>
                <TableHead>担当者</TableHead>
                <TableHead>媒体</TableHead>
                <TableHead>ADTR</TableHead>
                <TableHead className="text-right">許容CPA</TableHead>
                <TableHead className="text-right">月間目標Cost</TableHead>
                <TableHead className="text-right">月間目標CV</TableHead>
                <TableHead>状態</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="max-w-[200px] truncate font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">{p.ownerName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {p.mediaAccounts.join(" / ")}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.adtr}</TableCell>
                  <TableCell className="text-right">{formatCurrency(p.targetCpa)}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(p.monthlyTargetCost)}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(p.monthlyTargetCv)}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "active" ? "success" : "secondary"}>
                      {p.status === "active" ? "進行中" : p.status === "paused" ? "停止中" : "完了"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      {/* 権限管理 */}
      <TabsContent value="permissions" className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
            <Card key={role}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <p className="text-sm font-semibold">{ROLE_LABEL[role]}</p>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {ROLE_SCOPE[role]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>権限</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell>
                  <Select value={u.role} onValueChange={(v) => updateRole(u.id, v as Role)}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TabsContent>

      {/* 媒体連携 */}
      <TabsContent value="media" className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MEDIA_OPTIONS.map((m) => (
            <Card key={m}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m}</p>
                    <p className="text-[11px] text-muted-foreground">API連携</p>
                  </div>
                </div>
                <Badge variant="success">連携中</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
