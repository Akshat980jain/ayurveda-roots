import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/site/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type Search = { category?: string; q?: string; sort?: string; dosage?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: (s.category as string) || undefined,
    q: (s.q as string) || undefined,
    sort: (s.sort as string) || "popular",
    dosage: (s.dosage as string) || undefined,
  }),
  component: Shop,
  head: () => ({ meta: [{ title: "Shop · Ayurvedic Remedies — Vaidya & Co." }] }),
});

function Shop() {
  const search = Route.useSearch();
  const nav = Route.useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(search.q ?? "");

  useEffect(() => { supabase.from("categories").select("*").then(({ data }) => setCats(data ?? [])); }, []);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from("products").select("*, categories(slug,name)");
    if (search.category) query = query.eq("categories.slug", search.category);
    if (search.dosage) query = query.eq("dosage_type", search.dosage);
    if (search.q) query = query.ilike("name", `%${search.q}%`);
    if (search.sort === "price-asc") query = query.order("price", { ascending: true });
    else if (search.sort === "price-desc") query = query.order("price", { ascending: false });
    else query = query.order("num_reviews", { ascending: false });
    query.then(({ data }) => {
      let d = data ?? [];
      if (search.category) d = d.filter((p: any) => p.categories?.slug === search.category);
      setProducts(d); setLoading(false);
    });
  }, [search.category, search.dosage, search.q, search.sort]);

  const update = (patch: Partial<Search>) => nav({ search: { ...search, ...patch } });

  // debounced search
  useEffect(() => {
    const t = setTimeout(() => { if (q !== (search.q ?? "")) update({ q: q || undefined }); }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <header className="mb-8">
        <h1 className="font-display text-5xl font-semibold">All remedies</h1>
        <p className="mt-2 font-hindi text-muted-foreground">सारी जड़ी-बूटियाँ एक स्थान पर</p>
      </header>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <Select value={search.category ?? "all"} onValueChange={(v) => update({ category: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {cats.map((c) => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={search.dosage ?? "all"} onValueChange={(v) => update({ dosage: v === "all" ? undefined : v })}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Form" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All forms</SelectItem>
            {["Oil","Powder","Tablet","Kadha"].map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={search.sort ?? "popular"} onValueChange={(v) => update({ sort: v })}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Most popular</SelectItem>
            <SelectItem value="price-asc">Price: low → high</SelectItem>
            <SelectItem value="price-desc">Price: high → low</SelectItem>
          </SelectContent>
        </Select>
        {(search.category || search.dosage || search.q) && (
          <Button variant="ghost" onClick={() => { setQ(""); nav({ search: { sort: "popular" } as Search }); }}>Clear</Button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-muted-foreground">Loading remedies…</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No products match your filters.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
