import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm, fromRow, type ProductFormValues } from "@/components/admin/ProductForm";
import { Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/edit-product/$id")({ component: EditProduct });

function EditProduct() {
  const { id } = Route.useParams();
  const [initial, setInitial] = useState<ProductFormValues | null>(null);
  const [cats, setCats] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("id, name").then(({ data }) => setCats(data ?? []));
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      if (!data) setNotFound(true); else setInitial(fromRow(data));
    });
  }, [id]);

  if (notFound) return (
    <div className="rounded-2xl border border-border/60 bg-card p-10 text-center">
      <p className="text-muted-foreground">Product not found.</p>
      <Link to="/admin/products" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"><ArrowLeft className="size-4" /> Back to products</Link>
    </div>
  );
  if (!initial) return <div className="grid place-items-center p-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Edit product</h1>
      <p className="text-sm text-muted-foreground">{initial.name}</p>
      <div className="mt-5"><ProductForm initial={initial} categories={cats} mode="edit" /></div>
    </div>
  );
}
