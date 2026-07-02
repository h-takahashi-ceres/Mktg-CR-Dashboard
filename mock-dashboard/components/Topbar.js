export default function Topbar({ title }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primarylight text-sm font-semibold text-primary">
          田
        </div>
        <div className="hidden text-xs leading-tight sm:block">
          <p className="font-medium text-slate-800">田中 太郎</p>
          <p className="text-slate-400">管理者</p>
        </div>
      </div>
    </header>
  );
}
