import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { inr } from "@/lib/format";
import { imageForProduct } from "@/lib/product-images";

export function ProductCard({ p }: { p: any }) {
  const off = p.discount_price && p.price ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
  return (
    <Link to="/product/$slug" params={{ slug: p.slug }} className="group block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={imageForProduct(p)} alt={p.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-clay px-3 py-1 text-xs font-semibold text-white">-{off}%</span>}
        {p.dosage_type && <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground/80">{p.dosage_type}</span>}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-turmeric text-turmeric" /> {p.rating} · {p.num_reviews} reviews
        </div>
        <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{p.name}</h3>
        {p.hindi_name && <p className="font-hindi text-sm text-muted-foreground">{p.hindi_name}</p>}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-clay">{inr(p.discount_price ?? p.price)}</span>
          {p.discount_price && <span className="text-sm text-muted-foreground line-through">{inr(p.price)}</span>}
        </div>
      </div>
    </Link>
  );
}
