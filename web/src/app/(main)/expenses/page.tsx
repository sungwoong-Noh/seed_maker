import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ExpenseList } from "@/components/expenses/ExpenseList";

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
    <ExpenseList userId={user.id} yearMonth={yearMonth} />
  );
}
