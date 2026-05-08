import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Award, Leaf, Truck, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import hero from "@/assets/hero-herbs.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({ meta: [{ title: "Vaidya & Co. — Authentic Ayurveda from India" }] }),
});

function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("products").select("*").eq("is_featured", true).limit(4).then(({ data }) => setFeatured(data ?? []));
    supabase.from("categories").select("*").then(({ data }) => setCats(data ?? []));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-20 md:px-8 md:py-32 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-foreground/70">
              <Leaf className="size-3.5 text-primary" /> AYUSH · GMP · ISO Certified
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] md:text-6xl lg:text-7xl">
              Ancient roots,<br />
              <span className="italic text-clay">modern wellness</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              Handcrafted Ayurvedic remedies sourced from Indian soil. Made the way our grandmothers did — slow, intentional, complete.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop"><Button size="lg" className="rounded-full">Shop Remedies <ArrowRight className="ml-1 size-4" /></Button></Link>
              <Link to="/about"><Button size="lg" variant="outline" className="rounded-full">Our Philosophy</Button></Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Truck className="size-4 text-primary" /> Free shipping ₹499+</span>
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> COD Available</span>
              <span className="flex items-center gap-2"><Award className="size-4 text-primary" /> 100% Natural</span>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-4xl font-semibold">Shop by intent</h2>
          <p className="mt-2 font-hindi text-muted-foreground">अपने स्वास्थ्य के अनुसार चुनें</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cats.map((c) => (
            <Link key={c.id} to="/shop" search={{ category: c.slug }} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-secondary/60 p-8 text-center transition-all hover:bg-secondary hover:shadow-warm">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/15 text-primary"><Leaf className="size-7" /></div>
              <h3 className="mt-4 font-display text-xl font-semibold">{c.name}</h3>
              <p className="font-hindi text-sm text-muted-foreground">{c.hindi_name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-display text-4xl font-semibold">Bestsellers</h2>
              <p className="mt-1 text-muted-foreground">Loved by thousands across India</p>
            </div>
            <Link to="/shop" className="hidden text-sm font-medium text-primary hover:underline md:block">View all →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="grid gap-10 rounded-3xl bg-card p-10 shadow-soft md:grid-cols-2 md:p-16">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight">From the soil of India,<br />to your doorstep.</h2>
            <p className="mt-5 text-muted-foreground">Every herb is hand-picked from small organic farms across Kerala, Rajasthan, and the Himalayas. We follow recipes passed down through generations of Vaidyas (Ayurvedic doctors) — no shortcuts, no synthetic actives, no compromises.</p>
            <Link to="/about"><Button variant="outline" className="mt-6 rounded-full">Read our story</Button></Link>
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: "5000+", l: "Years of wisdom" },
              { n: "50+", l: "Curated remedies" },
              { n: "1L+", l: "Happy customers" },
              { n: "100%", l: "Natural ingredients" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-secondary/60 p-6 text-center">
                <div className="font-display text-3xl font-semibold text-clay">{s.n}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <h2 className="text-center font-display text-4xl font-semibold">Voices of trust</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { q: "The Kumkumadi oil transformed my skin in 3 weeks. Glow like never before!", n: "Priya S., Mumbai" },
            { q: "Finally an Ayurvedic brand that feels authentic, not commercial. Reminds me of my dadi.", n: "Rohan K., Delhi" },
            { q: "Their Chyawanprash is the real deal. Kept the family flu-free all winter.", n: "Anita M., Pune" },
          ].map((t) => (
            <div key={t.n} className="rounded-2xl border border-border/60 bg-card p-7 shadow-soft">
              <div className="text-3xl text-clay">"</div>
              <p className="font-display text-lg italic">{t.q}</p>
              <p className="mt-4 text-sm text-muted-foreground">— {t.n}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
