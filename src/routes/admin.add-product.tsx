import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductForm, emptyProduct } from "@/components/admin/ProductForm";

export const Route = createFileRoute("/admin/add-product")({ component: AddProduct });

function AddProduct() {
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => { supabase.from("categories").select("id, name").then(({ data }) => setCats(data ?? [])); }, []);
  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Add product</h1>
      <p className="text-sm text-muted-foreground">Create a new product in your catalog</p>
      <div className="mt-5"><ProductForm initial={emptyProduct} categories={cats} mode="create" /></div>
    </div>
  );
}
