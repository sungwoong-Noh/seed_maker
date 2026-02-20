import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExpenseList } from "@/components/expenses/ExpenseList";

function ExpenseListSkeleton() {
  return (
    <div className="mx-auto max-w-lg pb-24">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-emerald-100 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="text-lg font-bold text-emerald-800">🌱 Seed Maker</div>
        <h2 className="text-sm font-medium text-gray-700">지출 목록</h2>
      </header>
      <main className="px-4 py-6">
        <div className="rounded-xl border border-gray-100 bg-white divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex-1">
                <div className="h-5 w-24 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default async function ExpensesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const yearMonth =
    new Date().getFullYear() +
    "-" +
    String(new Date().getMonth() + 1).padStart(2, "0");

  return (
    <Suspense fallback={<ExpenseListSkeleton />}>
      <ExpenseList userId={user.id} yearMonth={yearMonth} />
    </Suspense>
  );
}
