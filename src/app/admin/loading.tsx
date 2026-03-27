import { AdminDashboardSkeleton } from '@/components/Skeletons';

export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] flex w-full">
      {/* Sidebar Placeholder */}
      <aside className="w-60 bg-white border-r border-black/[0.04] min-h-screen p-6 hidden lg:flex flex-col fixed left-0 top-0 h-full">
        <div className="text-xl font-black tracking-[0.3em] font-serif mb-10 text-black/20 animate-pulse">LUXEE</div>
        <div className="space-y-2">
            <div className="h-10 bg-black/5 rounded-xl animate-pulse"/>
            <div className="h-10 bg-black/5 rounded-xl animate-pulse"/>
            <div className="h-10 bg-black/5 rounded-xl animate-pulse"/>
        </div>
      </aside>

      <div className="flex-1 lg:ml-60 p-4 md:p-8 pb-24 lg:pb-8">
        <AdminDashboardSkeleton />
      </div>
    </main>
  );
}
