"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { FeedbackKanbanItem } from "./feedback-kanban-item";
import { updateFeedbackStatus } from "@/lib/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Inbox, Eye, CheckCircle2, Loader2 } from "lucide-react";

interface FeedbackKanbanClientProps {
  initialFeedbacks: any[];
}

export function FeedbackKanbanClient({ initialFeedbacks }: FeedbackKanbanClientProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  // Group feedbacks by status
  const columns = {
    pending: {
      id: "pending",
      title: "Pendente",
      icon: <Inbox className="h-4 w-4" />,
      color: "bg-orange-500/10 text-orange-600 border-orange-200/50",
      items: initialFeedbacks.filter((f) => f.status === "pending"),
    },
    viewed: {
      id: "viewed",
      title: "Em Análise",
      icon: <Eye className="h-4 w-4" />,
      color: "bg-blue-500/10 text-blue-600 border-blue-200/50",
      items: initialFeedbacks.filter((f) => f.status === "viewed"),
    },
    resolved: {
      id: "resolved",
      title: "Resolvido",
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
      items: initialFeedbacks.filter((f) => f.status === "resolved"),
    },
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId as "pending" | "viewed" | "resolved";
    
    setIsUpdating(true);
    try {
      const result = await updateFeedbackStatus(draggableId, newStatus);
      if (result.success) {
        toast.success(`Status atualizado para ${newStatus}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao atualizar status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative">
      {isUpdating && (
        <div className="absolute inset-0 z-50 bg-background/20 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
          <div className="bg-card border p-3 rounded-xl shadow-xl flex items-center gap-3 animate-in zoom-in-95 duration-200">
            <Loader2 className="h-5 w-5 animate-spin text-orange-600" />
            <span className="text-sm font-bold">Atualizando...</span>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="flex flex-col h-full group/column">
              {/* Column Header */}
              <div className={`p-4 rounded-t-2xl border-x border-t flex items-center justify-between ${column.color}`}>
                <div className="flex items-center gap-2">
                  {column.icon}
                  <h3 className="text-sm font-bold uppercase tracking-wider">{column.title}</h3>
                </div>
                <Badge variant="outline" className="bg-background/50 border-current/20 font-bold">
                  {column.items.length}
                </Badge>
              </div>

              {/* Column Body */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`flex-1 p-3 border rounded-b-2xl bg-muted/20 transition-colors duration-200 min-h-[500px] ${
                      snapshot.isDraggingOver ? "bg-muted/40" : ""
                    }`}
                  >
                    {column.items.length === 0 && !snapshot.isDraggingOver && (
                      <div className="h-full flex flex-col items-center justify-center opacity-30 mt-20">
                        <div className="mb-2 p-3 rounded-full bg-muted">
                          {column.icon}
                        </div>
                        <p className="text-[10px] uppercase font-bold tracking-widest">Nenhum item</p>
                      </div>
                    )}
                    
                    {column.items.map((feedback, index) => (
                      <FeedbackKanbanItem
                        key={feedback.id}
                        feedback={feedback}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
