import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BudgetForm } from "@/components/budget/BudgetForm";

export default async function BudgetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return <BudgetForm userId={user.id} />;
}
