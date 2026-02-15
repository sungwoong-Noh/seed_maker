import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { PageTransition } from "@/components/common/PageTransition";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <QueryProvider>
      <div className="min-h-screen bg-emerald-50/30">
        <PageTransition>{children}</PageTransition>
      </div>
    </QueryProvider>
  );
}
