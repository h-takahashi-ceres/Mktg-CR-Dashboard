import { Topbar } from "@/components/layout/Topbar";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default function CreativeRequestsPage() {
  return (
    <>
      <Topbar title="クリエイティブ入稿依頼" />
      <main className="flex flex-1 flex-col gap-4 overflow-hidden p-6">
        <KanbanBoard />
      </main>
    </>
  );
}
