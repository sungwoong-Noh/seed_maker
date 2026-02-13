import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PortfolioList } from "@/components/portfolio/PortfolioList";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <PortfolioList userId={user.id} />;
}
