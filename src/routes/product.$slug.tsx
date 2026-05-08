import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Heart, ShoppingBag, Leaf, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { inr } from "@/lib/format";
import { imageForProduct } from "@/lib/product-images";

export const Route = createFileRoute("/product/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [p, setP] = useState<any>(null);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  useEffect(() => {
    supabase.from("products").select("*").eq("slug", slug).maybeSingle().then(({ data }) => setP(data));
  }, [slug]);

  useEffect(() => {
    if (!p) return;
    supabase.from("reviews").select("*").eq("product_id", p.id).order("created_at", { ascending: false }).then(({ data }) => setReviews(data ?? []));
  }, [p]);

  const addToCart = async (buyNow = false) => {
    if (!user) { nav({ to: "/login" }); return; }
    const { data: existing } = await supabase.from("cart_items").select("*").eq("user_id", user.id).eq("product_id", p.id).maybeSingle();
    if (existing) {
      await supabase.from("cart_items").update({ quantity: existing.quantity + qty }).eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({ user_id: user.id, product_id: p.id, quantity: qty });
    }
    toast.success("Added to your jhola 🛍️");
    if (buyNow) nav({ to: "/cart" });
  };

  const addWishlist = async () => {
    if (!user) { nav({ to: "/login" }); return; }
    const { error } = await supabase.from("wishlist_items").insert({ user_id: user.id, product_id: p.id });
    if (!error) toast.success("Saved to wishlist");
    else toast.info("Already in wishlist");
  };

  const submitReview = async () => {
    if (!user) { nav({ to: "/login" }); return; }
    const { error } = await supabase.from("reviews").upsert({ user_id: user.id, product_id: p.id, rating: reviewRating, comment: reviewText });
    if (error) { toast.error(error.message); return; }
    toast.success("Review posted");
    setReviewText("");
    const { data } = await supabase.from("reviews").select("*").eq("product_id", p.id).order("created_at", { ascending: false });
    setReviews(data ?? []);
  };

  if (!p) return <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">Loading…</div>;
  const off = p.discount_price && p.price ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
      <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary">← Back to shop</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-secondary shadow-soft">
            <img src={imageForProduct(p)} alt={p.name} className="aspect-square w-full object-cover" />
          </div>
        </div>
        <div>
          {p.dosage_type && <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium">{p.dosage_type}</span>}
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">{p.name}</h1>
          {p.hindi_name && <p className="font-hindi mt-1 text-xl text-muted-foreground">{p.hindi_name}</p>}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Star className="size-4 fill-turmeric text-turmeric" />
            <span className="font-medium">{p.rating}</span>
            <span className="text-muted-foreground">· {p.num_reviews} reviews</span>
          </div>
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold text-clay">{inr(p.discount_price ?? p.price)}</span>
            {p.discount_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">{inr(p.price)}</span>
                <span className="rounded-full bg-clay/10 px-2 py-0.5 text-sm font-semibold text-clay">{off}% off</span>
              </>
            )}
          </div>
          <p className="mt-5 text-muted-foreground">{p.description}</p>

          {p.benefits?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-base font-semibold">Benefits</h3>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {p.benefits.map((b: string) => (
                  <li key={b} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 size-4 shrink-0 text-primary" /> {b}</li>
                ))}
              </ul>
            </div>
          )}

          {p.ingredients?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-display text-base font-semibold">Key ingredients</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.ingredients.map((i: string) => (
                  <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"><Leaf className="size-3" /> {i}</span>
                ))}
              </div>
            </div>
          )}

          {p.usage_instructions && (
            <div className="mt-6 rounded-2xl bg-secondary/60 p-4">
              <h3 className="font-display text-base font-semibold">How to use</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.usage_instructions}</p>
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2">−</button>
              <span className="w-10 text-center">{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="px-4 py-2">+</button>
            </div>
            <Button onClick={() => addToCart(false)} size="lg" variant="outline" className="rounded-full" disabled={p.stock === 0}>
              <ShoppingBag className="size-4" /> Add to cart
            </Button>
            <Button onClick={() => addToCart(true)} size="lg" className="rounded-full" disabled={p.stock === 0}>Buy now</Button>
            <Button onClick={addWishlist} size="lg" variant="ghost" className="rounded-full"><Heart className="size-4" /></Button>
          </div>
          {p.stock === 0 && <p className="mt-3 text-sm text-destructive">Out of stock</p>}
          {p.stock > 0 && p.stock < 10 && <p className="mt-3 text-sm text-clay">Only {p.stock} left — order soon</p>}
        </div>
      </div>

      {/* REVIEWS */}
      <section className="mt-20 border-t border-border pt-10">
        <h2 className="font-display text-3xl font-semibold">Customer reviews</h2>
        {user && (
          <div className="mt-6 rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((n) => (
                <button key={n} onClick={() => setReviewRating(n)}>
                  <Star className={`size-5 ${n <= reviewRating ? "fill-turmeric text-turmeric" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
            <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Share your experience…" className="mt-3 w-full rounded-md border border-border bg-background p-3 text-sm" rows={3} />
            <Button onClick={submitReview} className="mt-3">Post review</Button>
          </div>
        )}
        <div className="mt-6 space-y-4">
          {reviews.length === 0 && <p className="text-muted-foreground">No reviews yet. Be the first!</p>}
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((n) => <Star key={n} className={`size-4 ${n <= r.rating ? "fill-turmeric text-turmeric" : "text-muted-foreground"}`} />)}
              </div>
              {r.comment && <p className="mt-2 text-sm">{r.comment}</p>}
              <p className="mt-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
