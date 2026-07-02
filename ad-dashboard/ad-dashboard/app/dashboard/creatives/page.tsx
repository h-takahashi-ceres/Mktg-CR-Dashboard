import { Topbar } from "@/components/layout/Topbar";
import { CreativesClient } from "./creatives-client";

export default function CreativesPage() {
  return (
    <>
      <Topbar title="クリエイティブ分析" />
      <main className="flex flex-1 flex-col gap-6 p-6">
        <CreativesClient />
      </main>
    </>
  );
}
