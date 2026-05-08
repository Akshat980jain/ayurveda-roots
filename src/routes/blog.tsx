import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  component: Blog,
  head: () => ({ meta: [{ title: "Wisdom Blog · Vaidya & Co." }] }),
});

const POSTS = [
  { slug: "morning-rituals", title: "5 morning rituals from Ayurveda that actually work", excerpt: "From oil-pulling to tongue-scraping — small practices, big shifts.", read: "4 min read", herb: "Tulsi" },
  { slug: "ashwagandha-stress", title: "Ashwagandha & modern stress: what science is finally proving", excerpt: "An adaptogen used for 3,000 years gets the lab-coat treatment.", read: "6 min read", herb: "Ashwagandha" },
  { slug: "winter-immunity", title: "Why your dadi was right about Chyawanprash", excerpt: "The 40-herb formula that's still our best winter immunity tool.", read: "5 min read", herb: "Amla" },
  { slug: "skincare-doshas", title: "Find your dosha. Find your skincare.", excerpt: "Vata, Pitta, Kapha — and what your skin is trying to tell you.", read: "7 min read", herb: "Saffron" },
];

function Blog() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl font-semibold">Wisdom blog</h1>
      <p className="font-hindi mt-2 text-muted-foreground">आयुर्वेद की समझ</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {POSTS.map((p) => (
          <article key={p.slug} className="group rounded-3xl border border-border/60 bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:shadow-warm">
            <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{p.herb}</span>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-snug group-hover:text-primary">{p.title}</h2>
            <p className="mt-2 text-muted-foreground">{p.excerpt}</p>
            <p className="mt-4 text-xs text-muted-foreground">{p.read}</p>
          </article>
        ))}
      </div>
      <p className="mt-12 text-center text-sm text-muted-foreground">More articles coming soon. <Link to="/shop" className="text-primary underline">Browse remedies</Link></p>
    </div>
  );
}
