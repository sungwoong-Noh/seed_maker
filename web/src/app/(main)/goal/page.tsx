import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GoalForm } from "@/components/goal/GoalForm";

export default async function GoalPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const yearMonth =
    new Date().getFullYear() +
    "-" +
    String(new Date().getMonth() + 1).padStart(2, "0");

  return <GoalForm userId={user.id} yearMonth={yearMonth} />;
}
