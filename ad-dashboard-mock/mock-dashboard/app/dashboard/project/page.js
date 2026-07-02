import Topbar from "@/components/Topbar";
import ProjectTabs from "./project-tabs";

export default function ProjectKpiPage() {
  return (
    <>
      <Topbar title="案件KPI進捗" />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <ProjectTabs />
      </main>
    </>
  );
}
