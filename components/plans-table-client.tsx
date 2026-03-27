"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "@/components/ui/delete-confirm-dialog";
import { ActionButton } from "@/components/ui/action-button";
import { Pencil, Plus, DollarSign, Trash2 } from "lucide-react";
import { savePlan, deletePlan, togglePlanActive } from "@/lib/actions/plans";

export interface Plan {
  id: string;
  name: string;
  description: string | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_annual: string | null;
  amount_monthly_cents: number;
  amount_annual_cents: number;
  features: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface PlansTableClientProps {
  plans: Plan[];
}

export function PlansTableClient({ plans: initialPlans }: PlansTableClientProps) {
  const [plans, setPlans] = useState(initialPlans);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deletePlanId, setDeletePlanId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    stripe_price_id_monthly: "",
    stripe_price_id_annual: "",
    amount_monthly_cents: 19900,
    amount_annual_cents: 214900,
    features: "",
    active: true,
  });

  const openCreate = () => {
    setEditingPlan(null);
    setForm({
      name: "",
      description: "",
      stripe_price_id_monthly: "",
      stripe_price_id_annual: "",
      amount_monthly_cents: 19900,
      amount_annual_cents: 214900,
      features: "Laudos Ilimitados\nGestão Multitenant (Unidades)\nEditor Rich Text com Variáveis\nBiblioteca de Frases Personalizada\nAssinatura Digitalizada\nExportação A4 em PDF\nSuporte Prioritário\nArmazenamento Seguro em Nuvem",
      active: true,
    });
    setDialogOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name,
      description: plan.description || "",
      stripe_price_id_monthly: plan.stripe_price_id_monthly || "",
      stripe_price_id_annual: plan.stripe_price_id_annual || "",
      amount_monthly_cents: plan.amount_monthly_cents,
      amount_annual_cents: plan.amount_annual_cents,
      features: Array.isArray(plan.features) ? plan.features.join("\n") : "",
      active: plan.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const features = form.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    const result = await savePlan({
      id: editingPlan?.id,
      name: form.name,
      description: form.description || null,
      stripe_price_id_monthly: form.stripe_price_id_monthly || null,
      stripe_price_id_annual: form.stripe_price_id_annual || null,
      amount_monthly_cents: form.amount_monthly_cents,
      amount_annual_cents: form.amount_annual_cents,
      features,
      active: form.active,
    });
    setIsSaving(false);
    if (result.success) {
      setDialogOpen(false);
      window.location.reload();
    } else {
      alert(result.error || "Erro ao salvar plano");
    }
  };

  const handleDelete = async () => {
    if (!deletePlanId) return;
    setIsDeleting(true);
    const result = await deletePlan(deletePlanId);
    setIsDeleting(false);
    if (result.success) {
      setDeletePlanId(null);
      window.location.reload();
    } else {
      alert(result.error || "Erro ao excluir plano");
    }
  };

  const handleToggleActive = async (plan: Plan) => {
    const result = await togglePlanActive(plan.id, !plan.active);
    if (result.success) window.location.reload();
  };

  const columns = [
    {
      key: "name",
      label: "Plano",
      render: (row: Plan) => (
        <div>
          <span className="font-semibold">{row.name}</span>
          {row.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: "pricing",
      label: "Preços",
      render: (row: Plan) => (
        <div className="flex flex-col text-sm">
          <span>Mensal: R$ {(row.amount_monthly_cents / 100).toFixed(2).replace(".", ",")}</span>
          <span className="text-muted-foreground">Anual: R$ {(row.amount_annual_cents / 100).toFixed(2).replace(".", ",")}</span>
        </div>
      ),
    },
    {
      key: "stripe",
      label: "Stripe Price IDs",
      render: (row: Plan) => (
        <div className="flex flex-col gap-1 text-xs font-mono">
          {row.stripe_price_id_monthly ? (
            <Badge variant="outline" className="font-mono text-[10px] w-fit">M: {row.stripe_price_id_monthly.slice(0, 20)}…</Badge>
          ) : (
            <span className="text-muted-foreground">Mensal não config.</span>
          )}
          {row.stripe_price_id_annual ? (
            <Badge variant="outline" className="font-mono text-[10px] w-fit">A: {row.stripe_price_id_annual.slice(0, 20)}…</Badge>
          ) : (
            <span className="text-muted-foreground">Anual não config.</span>
          )}
        </div>
      ),
    },
    {
      key: "active",
      label: "Ativo",
      render: (row: Plan) => (
        <Switch
          checked={row.active}
          onCheckedChange={() => handleToggleActive(row)}
        />
      ),
    },
    {
      key: "actions",
      label: "Ações",
      render: (row: Plan) => (
        <div className="flex items-center gap-1">
          <ActionButton
            icon={Pencil}
            tooltip="Editar"
            onClick={() => openEdit(row)}
          />
          <ActionButton
            icon={Trash2}
            tooltip="Excluir"
            variant="destructive"
            onClick={() => setDeletePlanId(row.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button onClick={openCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Plano
          </Button>
        </div>
        <DataTable
          data={plans}
          columns={columns}
          getRowId={(row) => row.id}
          emptyMessage="Nenhum plano cadastrado."
          emptyAction={<Button onClick={openCreate}>Criar primeiro plano</Button>}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Editar Plano" : "Novo Plano"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ex: Plano Profissional"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Breve descrição do plano"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount_monthly">Valor Mensal (centavos)</Label>
                <Input
                  id="amount_monthly"
                  type="number"
                  value={form.amount_monthly_cents}
                  onChange={(e) => setForm({ ...form, amount_monthly_cents: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">Ex: 19900 = R$ 199,00</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount_annual">Valor Anual (centavos)</Label>
                <Input
                  id="amount_annual"
                  type="number"
                  value={form.amount_annual_cents}
                  onChange={(e) => setForm({ ...form, amount_annual_cents: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-muted-foreground">Ex: 214900 = R$ 2.149,00</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stripe_monthly">Stripe Price ID (Mensal)</Label>
                <Input
                  id="stripe_monthly"
                  value={form.stripe_price_id_monthly}
                  onChange={(e) => setForm({ ...form, stripe_price_id_monthly: e.target.value })}
                  placeholder="price_xxx"
                  className="font-mono text-xs"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stripe_annual">Stripe Price ID (Anual)</Label>
                <Input
                  id="stripe_annual"
                  value={form.stripe_price_id_annual}
                  onChange={(e) => setForm({ ...form, stripe_price_id_annual: e.target.value })}
                  placeholder="price_xxx"
                  className="font-mono text-xs"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="features">Recursos (um por linha)</Label>
              <Textarea
                id="features"
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                placeholder="Laudos Ilimitados&#10;Gestão Multitenant..."
                rows={5}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
              <Label htmlFor="active">Plano ativo (visível para clientes)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !form.name.trim()}>
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={!!deletePlanId}
        onOpenChange={(open) => !open && setDeletePlanId(null)}
        title="Excluir plano"
        description="Os clientes com assinatura neste plano não serão afetados. Novos clientes não poderão escolher este plano."
        itemName={plans.find((p) => p.id === deletePlanId)?.name}
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </>
  );
}
