import { Topbar } from "@/components/layout/Topbar";
import { SettingsClient } from "./settings-client";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="権限・設定" />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <SettingsClient />
      </main>
    </>
  );
}
