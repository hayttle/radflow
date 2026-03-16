import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/page-header";
import { FeedbackTableClient } from "@/components/feedback-table-client";
import { FeedbackKanbanClient } from "@/components/feedback-kanban-client";
import { LayoutGrid, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const feedbackData = feedbacks || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-10">
      <Tabs defaultValue="kanban" className="w-full">
        <PageHeader
          title="Feedbacks e Suporte"
          description="Acompanhe as necessidades e sugestões dos usuários."
          actions={
            <TabsList className="grid w-full md:w-[220px] grid-cols-2 h-10 bg-muted/30 p-1 border rounded-xl shadow-sm">
              <TabsTrigger value="table" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all h-full">
                <List className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Lista</span>
              </TabsTrigger>
              <TabsTrigger value="kanban" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all h-full">
                <LayoutGrid className="h-4 w-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Kanban</span>
              </TabsTrigger>
            </TabsList>
          }
        />

        <TabsContent value="table" className="m-0 focus-visible:outline-none">
          <div className="p-1 bg-gradient-to-br from-orange-600/10 via-transparent to-orange-600/10 rounded-2xl">
            <div className="rounded-2xl border shadow-sm overflow-hidden bg-card">
              <FeedbackTableClient feedbacks={feedbackData} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="kanban" className="m-0 focus-visible:outline-none">
          <FeedbackKanbanClient initialFeedbacks={feedbackData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
