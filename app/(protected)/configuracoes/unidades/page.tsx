import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/page-container";
import { UnitsClient } from "./UnitsClient";

export const metadata = { title: "Unidades | RadFlow" };

export default async function UnidadesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: units } = await supabase
    .from("units")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  return (
    <PageContainer>
      <UnitsClient units={units ?? []} />
    </PageContainer>
  );
}
