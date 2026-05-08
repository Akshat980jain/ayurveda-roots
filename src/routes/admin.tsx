import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inr } from "@/lib/format";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const Route = createFileRoute("/admin")({ component: Admin });

const empty = { name: "", slug: "", hindi_name: "", description: "", short_description: "", price: "", discount_price: "", stock: "0", category_id: "", dosage_type: "Powder", ingredients: "", benefits: "", usage_instructions: "", is_featured: false, images: [] as string[] };

function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(empty);
  const [open, setOpen] = useState(false);

  useEffect(() => { if (!loading && (!user || !isAdmin)) nav({ to: "/" }); }, [user, isAdmin, loading, nav]);

  const load = () => {
    supabase.from("products").select("*, categories(name)").order("created_at", { ascending: false }).then(({ data }) => setProducts(data ?? []));
    supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
    supabase.from("categories").select("*").then(({ data }) => setCats(data ?? []));
  };
  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const stats = useMemo(() => ({
    revenue: orders.reduce((s, o) => s + Number(o.total), 0),
    orderCount: orders.length,
    productCount: products.length,
    pending: orders.filter((o) => o.status === "pending").length,
  }), [orders, products]);

  const openNew = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      ...p,
      price: String(p.price), discount_price: p.discount_price ? String(p.discount_price) : "", stock: String(p.stock),
      ingredients: (p.ingredients ?? []).join(", "), benefits: (p.benefits ?? []).join(", "),
      images: p.images ?? [],
    });
    setOpen(true);
  };
  const save = async () => {
    const payload = {
      name: form.name, slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      hindi_name: form.hindi_name, description: form.description, short_description: form.short_description,
      price: Number(form.price), discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock: Number(form.stock), category_id: form.category_id || null, dosage_type: form.dosage_type,
      ingredients: form.ingredients.split(",").map((s: string) => s.trim()).filter(Boolean),
      benefits: form.benefits.split(",").map((s: string) => s.trim()).filter(Boolean),
      usage_instructions: form.usage_instructions, is_featured: !!form.is_featured,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    if (error) return toast.error(error.message);
    toast.success(editing ? "Updated" : "Created");
    setOpen(false); load();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted"); load(); }
  };
  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status: status as any }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Updated"); load(); }
  };

  if (loading || !isAdmin) return <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">Loading…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <h1 className="font-display text-4xl font-semibold">Admin dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat l="Revenue" v={inr(stats.revenue)} />
        <Stat l="Orders" v={String(stats.orderCount)} />
        <Stat l="Products" v={String(stats.productCount)} />
        <Stat l="Pending" v={String(stats.pending)} />
      </div>

      <Tabs defaultValue="products" className="mt-8">
        <TabsList><TabsTrigger value="products">Products</TabsTrigger><TabsTrigger value="orders">Orders</TabsTrigger></TabsList>

        <TabsContent value="products" className="pt-6">
          <div className="mb-4 flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button onClick={openNew} className="rounded-full"><Plus className="size-4" /> New product</Button></DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader><DialogTitle>{editing ? "Edit" : "New"} product</DialogTitle></DialogHeader>
                <div className="grid gap-3 sm:grid-cols-2">
                  <F l="Name" v={form.name} on={(v) => setForm({ ...form, name: v })} />
                  <F l="Hindi name" v={form.hindi_name} on={(v) => setForm({ ...form, hindi_name: v })} />
                  <F l="Slug (auto)" v={form.slug} on={(v) => setForm({ ...form, slug: v })} />
                  <div><Label>Category</Label>
                    <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                      <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <F l="Price" v={form.price} on={(v) => setForm({ ...form, price: v })} />
                  <F l="Discount price" v={form.discount_price} on={(v) => setForm({ ...form, discount_price: v })} />
                  <F l="Stock" v={form.stock} on={(v) => setForm({ ...form, stock: v })} />
                  <div><Label>Form</Label>
                    <Select value={form.dosage_type} onValueChange={(v) => setForm({ ...form, dosage_type: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>{["Oil","Powder","Tablet","Kadha"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2"><Label>Short description</Label><Input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="mt-1" /></div>
                  <div className="sm:col-span-2"><Label>Description</Label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1 w-full rounded-md border border-border bg-background p-2 text-sm" /></div>
                  <div className="sm:col-span-2"><Label>Ingredients (comma-separated)</Label><Input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="mt-1" /></div>
                  <div className="sm:col-span-2"><Label>Benefits (comma-separated)</Label><Input value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} className="mt-1" /></div>
                  <div className="sm:col-span-2"><Label>Usage instructions</Label><Input value={form.usage_instructions} onChange={(e) => setForm({ ...form, usage_instructions: e.target.value })} className="mt-1" /></div>
                  <label className="flex items-center gap-2 sm:col-span-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
                </div>
                <Button onClick={save} className="mt-4">Save</Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left"><tr><th className="p-3">Name</th><th className="p-3">Cat</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3"></th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="p-3"><Link to="/product/$slug" params={{ slug: p.slug }} className="font-medium hover:text-primary">{p.name}</Link></td>
                    <td className="p-3 text-muted-foreground">{p.categories?.name ?? "—"}</td>
                    <td className="p-3">{inr(p.discount_price ?? p.price)}</td>
                    <td className={`p-3 ${p.stock < 10 ? "text-clay" : ""}`}>{p.stock}</td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="size-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="size-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="pt-6 space-y-3">
          {orders.length === 0 && <p className="text-muted-foreground">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div><div className="font-mono text-sm">#{o.id.slice(0,8)}</div><div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()} · {o.payment_method.toUpperCase()}</div></div>
                <Select value={o.status} onValueChange={(v) => updateOrderStatus(o.id, v)}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>{["pending","confirmed","shipped","delivered","cancelled"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{(o.items as any[]).map((i) => `${i.name} × ${i.quantity}`).join(", ")}</div>
              <div className="mt-1 text-sm">📍 {(o.shipping_address as any).city}, {(o.shipping_address as any).state} — {(o.shipping_address as any).pincode}</div>
              <div className="mt-2 font-semibold text-clay">{inr(o.total)}</div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
function Stat({ l, v }: any) { return <div className="rounded-2xl border border-border/60 bg-card p-5"><div className="text-xs text-muted-foreground">{l}</div><div className="mt-1 font-display text-3xl font-semibold text-clay">{v}</div></div>; }
function F({ l, v, on }: { l: string; v: string; on: (v: string) => void }) { return <div><Label>{l}</Label><Input value={v} onChange={(e) => on(e.target.value)} className="mt-1" /></div>; }
