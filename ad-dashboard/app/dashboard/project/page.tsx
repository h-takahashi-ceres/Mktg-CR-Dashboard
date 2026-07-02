import { Topbar } from "@/components/layout/Topbar";
import { ProjectKpiClient } from "./project-kpi-client";

export default function ProjectKpiPage() {
  return (
    <>
      <Topbar title="案件KPI進捗" />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <ProjectKpiClient />
      </main>
    </>
  );
}
