import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/order/$id")({ component: OrderConfirm });

function OrderConfirm() {
  const { id } = Route.useParams();
  const [o, setO] = useState<any>(null);
  useEffect(() => { supabase.from("orders").select("*").eq("id", id).maybeSingle().then(({ data }) => setO(data)); }, [id]);
  if (!o) return <div className="mx-auto max-w-3xl px-4 py-20 md:px-8">Loading…</div>;
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-8">
      <div className="rounded-3xl border border-border/60 bg-card p-10 text-center shadow-soft">
        <CheckCircle2 className="mx-auto size-16 text-primary" />
        <h1 className="mt-4 font-display text-4xl font-semibold">Dhanyavaad! 🙏</h1>
        <p className="font-hindi text-muted-foreground">आपका ऑर्डर मिल गया है</p>
        <p className="mt-4 text-muted-foreground">Your order <span className="font-mono text-foreground">#{o.id.slice(0,8)}</span> has been received.</p>
        <p className="mt-2 text-sm text-muted-foreground">Estimated delivery: 4–7 business days</p>
        <div className="mt-6 inline-flex items-baseline gap-2 rounded-full bg-secondary px-5 py-2"><span className="text-sm text-muted-foreground">Total paid</span><span className="font-display text-lg font-semibold text-clay">{inr(o.total)}</span></div>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/account"><Button variant="outline" className="rounded-full">View orders</Button></Link>
          <Link to="/shop"><Button className="rounded-full">Continue shopping</Button></Link>
        </div>
      </div>
    </div>
  );
}
