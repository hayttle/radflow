import { createClient } from "@/lib/supabase/server";
import { FeedbackTableClient } from "@/components/feedback-table-client";
import { MessageSquare } from "lucide-react";

export const metadata = { title: "Gerenciar Feedbacks | Admin" };

export default async function FeedbacksPage() {
  const supabase = await createClient();

  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select(`
      *,
      profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-orange-600/10 text-orange-600">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Feedbacks e Suporte</h1>
          <p className="text-muted-foreground text-sm">Acompanhe as necessidades e sugestões dos usuários.</p>
        </div>
      </div>

      <div className="rounded-2xl border shadow-sm overflow-hidden bg-card">
        <FeedbackTableClient feedbacks={feedbacks || []} />
      </div>
    </div>
  );
}
