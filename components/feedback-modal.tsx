"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FeedbackSchema, type FeedbackInput } from "@/lib/validations";
import { submitFeedback } from "@/lib/actions/feedback";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MessageSquarePlus } from "lucide-react";

interface FeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      type: "suggestion",
      title: "",
      description: "",
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: FeedbackInput) => {
    setIsPending(true);
    try {
      const result = await submitFeedback(data);

      if (result.success) {
        toast.success(result.message);
        reset();
        onOpenChange(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao enviar seu feedback.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl bg-background/95 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <MessageSquarePlus className="h-5 w-5" />
              </div>
              <DialogTitle className="text-xl font-bold">Enviar Feedback</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Sua opinião é fundamental para evoluirmos o RadFlow. Sugestões, críticas ou erros, tudo é bem-vindo!
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 pb-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-semibold">Tipo de Feedback</Label>
              <Select
                value={selectedType}
                onValueChange={(val: any) => setValue("type", val)}
              >
                <SelectTrigger className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="suggestion">Sugestão</SelectItem>
                  <SelectItem value="bug">Reportar Erro (Bug)</SelectItem>
                  <SelectItem value="critique">Crítica</SelectItem>
                  <SelectItem value="feature_request">Nova Funcionalidade</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-destructive font-medium">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">Título</Label>
              <Input
                id="title"
                placeholder="Resuma seu feedback em poucas palavras"
                {...register("title")}
                className="h-11 bg-muted/30 border-muted-foreground/20 focus:ring-primary/30"
              />
              {errors.title && (
                <p className="text-xs text-destructive font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Conte-nos mais detalhes..."
                {...register("description")}
                className="min-h-[120px] bg-muted/30 border-muted-foreground/20 focus:ring-primary/30 resize-none py-3"
              />
              {errors.description && (
                <p className="text-xs text-destructive font-medium">{errors.description.message}</p>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 pt-0 flex gap-3 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              className="flex-1 sm:flex-none min-w-[120px] bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar Feedback"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
