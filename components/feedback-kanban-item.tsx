"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Calendar, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FeedbackStatusSwitcher } from "@/components/feedback-status-switcher";

interface FeedbackKanbanItemProps {
  feedback: any;
  index: number;
}

export function FeedbackKanbanItem({ feedback, index }: FeedbackKanbanItemProps) {
  const typeLabels: any = {
    bug: "Bug",
    suggestion: "Sugestão",
    critique: "Crítica",
    feature_request: "Funcionalidade",
  };

  const typeColors: any = {
    bug: "destructive",
    suggestion: "secondary",
    critique: "outline",
    feature_request: "default",
  };

  const initials = feedback.profiles?.full_name?.[0] || "U";

  return (
    <Draggable draggableId={feedback.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`group relative bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 mb-3 ${
            snapshot.isDragging ? "ring-2 ring-orange-500 shadow-xl scale-[1.02] z-50 bg-accent/20" : ""
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3 gap-2">
            <Badge variant={typeColors[feedback.type] || "outline"} className="text-[10px] h-5 px-1.5 uppercase font-bold tracking-wider">
              {typeLabels[feedback.type] || feedback.type}
            </Badge>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
              {format(new Date(feedback.created_at), "dd/MM/yy", { locale: ptBR })}
            </span>
          </div>

          {/* Content */}
          <div className="space-y-2 mb-4">
            <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-2">
              {feedback.title}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {feedback.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2 max-w-[140px]">
              <div className="h-6 w-6 rounded-full bg-orange-600/10 text-orange-600 flex items-center justify-center text-[10px] font-bold">
                {initials}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold truncate leading-none">
                  {feedback.profiles?.full_name?.split(' ')[0]}
                </span>
                <span className="text-[9px] text-muted-foreground truncate">
                  {feedback.profiles?.email}
                </span>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="h-3.5 w-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-card">
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={typeColors[feedback.type] || "outline"} className="uppercase font-bold tracking-wider">
                      {typeLabels[feedback.type] || feedback.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(feedback.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <DialogTitle className="text-2xl font-bold tracking-tight">{feedback.title}</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 mt-6">
                  <div className="p-4 rounded-xl bg-muted/30 whitespace-pre-wrap text-foreground text-sm leading-relaxed border border-border/50">
                    {feedback.description}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t pt-6 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-orange-600/10 text-orange-600 flex items-center justify-center font-bold text-lg">
                        {initials}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{feedback.profiles?.full_name}</span>
                        <span className="text-xs text-muted-foreground">{feedback.profiles?.email}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 min-w-[140px]">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Estágio</span>
                      <FeedbackStatusSwitcher feedbackId={feedback.id} currentStatus={feedback.status} />
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </Draggable>
  );
}
