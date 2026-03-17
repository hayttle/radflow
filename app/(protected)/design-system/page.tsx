"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContainer } from "@/components/page-container";

export default function DesignSystemPage() {
  const [progressValue, setProgressValue] = useState(13);

  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Design System"
      description="Um guia visual completo de todos os componentes do shadcn/ui integrados, estilizados com as variáveis do seu globals.css."
      actions={<Badge variant="outline" className="px-3 py-1 bg-primary/5 text-primary border-primary/20">v1.0.4 - Production</Badge>}
    >
      <div className="space-y-20">

      {/* 0. Color Tokens */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">0. Color Tokens</h2>
          <p className="text-muted-foreground">
            Variáveis semânticas do design system. Alterne o tema no cabeçalho para ver as cores reagirem em tempo real.
          </p>
        </div>
        <Separator className="bg-primary/20" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            { label: "background",        cls: "bg-background border"                            },
            { label: "foreground",        cls: "bg-foreground"                                    },
            { label: "primary",           cls: "bg-primary"                                       },
            { label: "primary-fg",        cls: "bg-primary-foreground border"                     },
            { label: "secondary",         cls: "bg-secondary"                                     },
            { label: "secondary-fg",      cls: "bg-secondary-foreground"                          },
            { label: "accent",            cls: "bg-accent"                                        },
            { label: "accent-fg",         cls: "bg-accent-foreground"                             },
            { label: "muted",             cls: "bg-muted"                                         },
            { label: "muted-fg",          cls: "bg-muted-foreground"                              },
            { label: "card",              cls: "bg-card border"                                   },
            { label: "card-fg",           cls: "bg-card-foreground"                               },
            { label: "destructive",       cls: "bg-destructive"                                   },
            { label: "border",            cls: "border-4 border-border bg-card"                   },
            { label: "ring",              cls: "ring-4 ring-ring ring-offset-2 bg-background"     },
          ].map(({ label, cls }) => (
            <div key={label} className="space-y-2">
              <div className={`h-14 w-full rounded-xl shadow-sm ${cls}`} />
              <p className="text-xs font-mono text-muted-foreground truncate">
                --{label}
              </p>
            </div>
          ))}
        </div>

        {/* Chart palette row */}
        <div className="space-y-3">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Charts</p>
          <div className="flex gap-4 flex-wrap">
            {[
              { label: "chart-1", cls: "bg-[hsl(var(--chart-1))]" },
              { label: "chart-2", cls: "bg-[hsl(var(--chart-2))]" },
              { label: "chart-3", cls: "bg-[hsl(var(--chart-3))]" },
              { label: "chart-4", cls: "bg-[hsl(var(--chart-4))]" },
              { label: "chart-5", cls: "bg-[hsl(var(--chart-5))]" },
            ].map(({ label, cls }) => (
              <div key={label} className="space-y-1 text-center">
                <div className={`h-10 w-10 rounded-lg shadow-sm ${cls}`} />
                <p className="text-[10px] font-mono text-muted-foreground">--{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">1. Typography</h2>
          <p className="text-muted-foreground">Estilos fundamentais de texto e cabeçalhos.</p>
        </div>
        <Separator className="bg-primary/20" />
        
        <div className="space-y-10">
          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Heading 1 (H1)
            </h1>
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl
            </code>
          </div>
          
          <div className="space-y-2">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Heading 2 (H2)
            </h2>
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0
            </code>
          </div>

          <div className="space-y-2">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Heading 3 (H3)
            </h3>
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              scroll-m-20 text-2xl font-semibold tracking-tight
            </code>
          </div>

          <div className="space-y-2">
            <p className="leading-7 [&:not(:first-child)]:mt-6 max-w-3xl">
              Este é o corpo de texto padrão (P). Ele utiliza uma altura de linha otimizada para legibilidade. 
              The quick brown fox jumps over the lazy dog. Sedges non dummy text.
            </p>
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              leading-7 [&:not(:first-child)]:mt-6
            </code>
          </div>

          <div className="space-y-2">
            <p className="text-xl text-muted-foreground">
              Lead: Texto de introdução com peso leve e tamanho maior.
            </p>
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              text-xl text-muted-foreground
            </code>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground font-medium">
              Muted: Texto secundário para descrições e metadados.
            </p>
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              text-sm text-muted-foreground
            </code>
          </div>

          <div className="space-y-2">
            <blockquote className="mt-6 border-l-2 pl-6 italic text-muted-foreground">
              &quot;Typography is the craft of endowing human language with a durable visual form.&quot;
            </blockquote>
            <code className="text-[11px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              mt-6 border-l-2 pl-6 italic
            </code>
          </div>
        </div>
      </section>

      {/* 2. Buttons */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">2. Buttons</h2>
          <p className="text-muted-foreground">Ações e gatilhos interativos.</p>
        </div>
        <Separator className="bg-primary/20" />
        
        <div className="space-y-8">
          <div className="flex flex-wrap gap-4">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <span className="sr-only">Icon</span>
              ⭐
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Forms */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">3. Forms & Inputs</h2>
          <p className="text-muted-foreground">Captura de dados e seleção.</p>
        </div>
        <Separator className="bg-primary/20" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="email-full">Email Input</Label>
              <Input type="email" id="email-full" placeholder="exemplo@email.com" />
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="message-full">Textarea</Label>
              <Textarea placeholder="Digite sua mensagem detalhada aqui." id="message-full" rows={4} />
            </div>
            
            <div className="flex items-center space-x-2 bg-muted/30 p-4 rounded-lg">
              <Checkbox id="terms-full" />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms-full" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Aceitar termos
                </Label>
                <p className="text-xs text-muted-foreground">Você concorda com nossos termos de serviço.</p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="airplane-full">Modo Avião</Label>
                <p className="text-xs text-muted-foreground">Desativar todas as comunicações.</p>
              </div>
              <Switch id="airplane-full" />
            </div>
          </div>

          <div className="space-y-8">
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label>Select Component</Label>
              <Select defaultValue="system">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="system">System Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
              <Label className="text-base font-semibold">Radio Group Selection</Label>
              <RadioGroup defaultValue="advanced">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="beginner" id="radio-full-1" />
                  <Label htmlFor="radio-full-1" className="font-normal">Beginner</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="intermediate" id="radio-full-2" />
                  <Label htmlFor="radio-full-2" className="font-normal">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="advanced" id="radio-full-3" />
                  <Label htmlFor="radio-full-3" className="font-normal">Advanced Professional</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Feedback */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">4. Feedback & Status</h2>
          <p className="text-muted-foreground">Indicadores visuais de estado e progresso.</p>
        </div>
        <Separator className="bg-primary/20" />
        
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="success">Success</Badge>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Status Badges (Laudos)</p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-sm font-medium">
                <Clock className="h-3.5 w-3.5" /> Pendente
              </Badge>
              <Badge variant="default" className="gap-1.5 px-3 py-1 text-sm font-medium">
                <AlertCircle className="h-3.5 w-3.5" /> Em andamento
              </Badge>
              <Badge variant="success" className="gap-1.5 px-3 py-1 text-sm font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Concluído
              </Badge>
            </div>
          </div>
          
          <div className="space-y-8 max-w-md">
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <Label>Progress Bar</Label>
                  <p className="text-xs text-muted-foreground font-mono">Simulando carregamento...</p>
                </div>
                <span className="text-sm font-bold">{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="w-full h-2.5" />
            </div>

            <div className="p-4 border rounded-xl bg-card">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[160px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Overlay */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">5. Overlays</h2>
          <p className="text-muted-foreground">Diálogos, modais e informações flutuantes.</p>
        </div>
        <Separator className="bg-primary/20" />
        
        <div className="flex flex-wrap gap-6 items-center">
          {/* Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="shadow-sm">Hover me (Tooltip)</Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Informação adicional via Tooltip!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Dialog (Modal) */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="shadow-sm">Abrir Modal (Dialog)</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Título do Modal</DialogTitle>
                <DialogDescription>
                  Este é um modal completo para ações críticas ou formulários isolados.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dialog-name" className="text-right">Nome</Label>
                  <Input id="dialog-name" defaultValue="Usuário Teste" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Confirmar Ação</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sheet (Drawer) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="shadow-sm">Abrir Sidebar (Sheet)</Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Opções do Sistema</SheetTitle>
                <SheetDescription>
                  Painel lateral para configurações rápidas ou menus.
                </SheetDescription>
              </SheetHeader>
              <div className="py-8 space-y-4">
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">Configurações de Conta</Button>
                  <Button variant="outline" className="justify-start">Preferências Globais</Button>
                  <Button variant="destructive" className="justify-start">Encerrar Sessão</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="shadow-sm">Abrir Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Configurações</h4>
                  <p className="text-sm text-muted-foreground">Ajuste os parâmetros aqui.</p>
                </div>
                <div className="grid gap-3 font-mono text-xs">
                  <div className="flex justify-between border-b pb-1">
                    <span>Versão</span>
                    <span>1.0.4-stable</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span className="text-green-500 underline">Ativo</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* 6. Tabs Standalone */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">6. Tab Interface</h2>
          <p className="text-muted-foreground">Alternância entre visualizações lógicas.</p>
        </div>
        <Separator className="bg-primary/20" />
        
        <Tabs defaultValue="overview" className="w-full max-w-xl">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Painel de Controle</CardTitle>
                <CardDescription>Resumo das atividades recentes.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic underline decoration-primary/30">Nenhuma atividade registrada no momento.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="settings" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacidade</CardTitle>
                <CardDescription>Altere suas opções de visibilidade.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="tab-check" />
                  <Label htmlFor="tab-check">Perfil Público</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* 7. Cards */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">7. Cards & Containers</h2>
          <p className="text-muted-foreground">Agrupamento estruturado de conteúdo complexo.</p>
        </div>
        <Separator className="bg-primary/20" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="w-full h-full flex flex-col shadow-lg transition-all hover:shadow-xl border-primary/10">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle>Analytics Engine</CardTitle>
                  <CardDescription>Métricas de tempo real.</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Enterprise</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="h-32 w-full bg-muted/50 rounded-xl flex items-center justify-center border-2 border-dashed border-muted">
                <span className="text-muted-foreground text-xs font-mono uppercase tracking-widest">Visual Data Hub</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cards são fundamentais no nosso sistema para criar dashboards e feeds informativos de alta qualidade visual.
              </p>
            </CardContent>
            <CardFooter className="flex justify-between border-t gap-4 pt-4 mt-auto">
              <Button variant="ghost" size="sm" className="flex-1">Ignorar</Button>
              <Button size="sm" className="flex-1">Explorar Dados</Button>
            </CardFooter>
          </Card>

          <Card className="w-full border-none bg-primary/5 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg">Dica do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tente combinar componentes de overlay com formulários para uma experiência de usuário mais rica.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </PageContainer>
  );
}
