import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({ meta: [{ title: "Contact · Vaidya & Co." }] }),
});

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
      <h1 className="font-display text-5xl font-semibold">Get in touch</h1>
      <p className="font-hindi mt-2 text-muted-foreground">हमसे संपर्क करें</p>
      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <Item i={Phone} t="Call us" v="+91 99999 99999" />
          <Item i={Mail} t="Email" v="hello@vaidyaco.in" />
          <Item i={MapPin} t="Workshop" v="12, Herb Lane, Fort Kochi, Kerala 682001" />
          <a href="https://wa.me/919999999999" target="_blank" rel="noreferrer">
            <Button className="rounded-full bg-[#25D366] hover:bg-[#1ea354]"><MessageCircle className="size-4" /> WhatsApp us</Button>
          </a>
          <iframe className="mt-6 h-72 w-full rounded-2xl border border-border" loading="lazy" title="Map" src="https://www.openstreetmap.org/export/embed.html?bbox=76.236%2C9.962%2C76.246%2C9.972&layer=mapnik" />
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Thank you! We'll get back within 24 hours."); setF({ name: "", email: "", message: "" }); }} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
          <h2 className="font-display text-2xl font-semibold">Send a message</h2>
          <div className="mt-5 space-y-3">
            <div><Label>Your name</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required className="mt-1" /></div>
            <div><Label>Email</Label><Input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required className="mt-1" /></div>
            <div><Label>Message</Label><textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} required rows={5} className="mt-1 w-full rounded-md border border-border bg-background p-3 text-sm" /></div>
            <Button type="submit" className="w-full rounded-full">Send message</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
function Item({ i: I, t, v }: any) {
  return <div className="flex items-start gap-4"><I className="mt-1 size-5 text-primary" /><div><div className="font-display text-base font-semibold">{t}</div><div className="text-muted-foreground">{v}</div></div></div>;
}
