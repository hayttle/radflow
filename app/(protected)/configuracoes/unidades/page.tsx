import {createClient} from "@/lib/supabase/server"
import {redirect} from "next/navigation"
import {PageContainer} from "@/components/shared/page-container"
import {UnitsClient} from "./UnitsClient"

export const metadata = {title: "Unidades | RadFlow"}

export default async function UnidadesPage() {
  const supabase = await createClient()
  const {
    data: {user}
  } = await supabase.auth.getUser()

  if (!user) redirect("/auth/login")

  const [{ data: units }, { data: profile }] = await Promise.all([
    supabase.from("units").select("*").eq("user_id", user.id).order("name", { ascending: true }),
    supabase.from("profiles").select("full_name, crm, signature").eq("id", user.id).single(),
  ]);

  return (
    <PageContainer>
      <UnitsClient units={units ?? []} printPreviewProfile={profile ?? null} />
    </PageContainer>
  )
}
