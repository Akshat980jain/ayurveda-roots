import { createFileRoute } from "@tanstack/react-router";
import { Award, Leaf, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({ meta: [{ title: "Our Story · Vaidya & Co." }, { name: "description", content: "Three generations of Vaidyas. Authentic Ayurvedic wisdom from the soil of India." }] }),
});

function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl font-semibold leading-tight md:text-6xl">A little jhola of <span className="italic text-clay">India's wisdom</span>.</h1>
      <p className="font-hindi mt-3 text-xl text-muted-foreground">भारत की पुरानी विरासत</p>
      <p className="mt-8 text-lg text-muted-foreground">Vaidya & Co. began in a small kitchen in Kerala, where my grandmother — a third-generation Vaidya — would mix herbs in a brass kadhai every Sunday morning. Neighbours would come for her remedies. Children for her sweets. Everyone for her stories.</p>
      <p className="mt-4 text-lg text-muted-foreground">We started Vaidya & Co. to keep that kitchen alive. Every product you see here is made the slow way — small batches, single-origin herbs, no synthetic actives, no shortcuts.</p>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {[
          { i: Leaf, t: "Single-origin herbs", d: "Sourced from organic farms in Kerala, Rajasthan and the Himalayas." },
          { i: Heart, t: "Slow-made", d: "Every batch is hand-mixed and ferments naturally for weeks, not minutes." },
          { i: Award, t: "Certified", d: "AYUSH licensed, GMP & ISO 9001 certified manufacturing." },
        ].map((v) => (
          <div key={v.t} className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            <v.i className="size-7 text-primary" />
            <h3 className="mt-3 font-display text-lg font-semibold">{v.t}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
          </div>
        ))}
      </div>
      <section className="mt-16 rounded-3xl bg-secondary/60 p-10">
        <h2 className="font-display text-3xl font-semibold">Our Ayurvedic philosophy</h2>
        <p className="mt-4 text-muted-foreground">Ayurveda — literally "the science of life" — is over 5,000 years old. It teaches that wellness comes not from masking symptoms but from restoring balance between body, mind and the elements. We make products that respect that balance.</p>
        <p className="font-hindi mt-4 text-lg italic text-clay">"स्वास्थ्यं परम भाग्यम्" — Health is the highest fortune.</p>
      </section>
    </div>
  );
}
