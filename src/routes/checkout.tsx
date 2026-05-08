import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { inr } from "@/lib/format";
import { toast } from "sonner";

type Search = { coupon?: string; discount?: number };

export const Route = createFileRoute("/checkout")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    coupon: (s.coupon as string) || undefined,
    discount: Number(s.discount) || 0,
  }),
  component: Checkout,
});

function Checkout() {
  const { coupon, discount = 0 } = Route.useSearch();
  const { user } = useAuth();
  const nav = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ full_name: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
  const [method, setMethod] = useState<"cod" | "razorpay" | "upi">("cod");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!user) { nav({ to: "/login" }); return; }
    supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id).then(({ data }) => setItems(data ?? []));
  }, [user, nav]);

  const subtotal = items.reduce((s, i) => s + (i.products.discount_price ?? i.products.price) * i.quantity, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = Math.max(0, subtotal - discount) + shipping;

  const placeOrder = async () => {
    if (!user) return;
    if (!form.full_name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      toast.error("Please complete the address"); return;
    }
    if (items.length === 0) { toast.error("Cart is empty"); return; }
    setPlacing(true);
    const orderItems = items.map((i) => ({
      product_id: i.products.id, name: i.products.name, price: i.products.discount_price ?? i.products.price, quantity: i.quantity,
    }));
    const { data, error } = await supabase.from("orders").insert({
      user_id: user.id, items: orderItems, shipping_address: form, subtotal, discount, shipping, total,
      payment_method: method, payment_status: method === "cod" ? "pending" : "pending",
      coupon_code: coupon ?? null,
    }).select().single();
    if (error) { toast.error(error.message); setPlacing(false); return; }
    await supabase.from("cart_items").delete().eq("user_id", user.id);
    if (method !== "cod") {
      toast.info("Online payment integration coming next — order saved as pending.");
    }
    nav({ to: "/order/$id", params: { id: data.id } });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
      <h1 className="font-display text-4xl font-semibold">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Shipping address</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Full name" v={form.full_name} on={(v) => setForm({ ...form, full_name: v })} />
              <Field label="Phone" v={form.phone} on={(v) => setForm({ ...form, phone: v })} />
              <div className="sm:col-span-2"><Field label="Address line 1" v={form.line1} on={(v) => setForm({ ...form, line1: v })} /></div>
              <div className="sm:col-span-2"><Field label="Landmark / Apt" v={form.line2} on={(v) => setForm({ ...form, line2: v })} /></div>
              <Field label="City" v={form.city} on={(v) => setForm({ ...form, city: v })} />
              <Field label="State" v={form.state} on={(v) => setForm({ ...form, state: v })} />
              <Field label="Pincode" v={form.pincode} on={(v) => setForm({ ...form, pincode: v })} />
            </div>
          </section>

          <section className="rounded-2xl border border-border/60 bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Payment method</h2>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as any)} className="mt-4 space-y-3">
              <PayOption value="cod" id="cod" title="Cash on Delivery" desc="Pay when you receive — most popular in India" checked={method==='cod'} />
              <PayOption value="razorpay" id="razorpay" title="Razorpay (Card / Netbanking)" desc="Secure online payment — coming soon" checked={method==='razorpay'} />
              <PayOption value="upi" id="upi" title="UPI" desc="Pay via PhonePe, GPay, Paytm — coming soon" checked={method==='upi'} />
            </RadioGroup>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between">
                <span className="text-muted-foreground">{i.products.name} × {i.quantity}</span>
                <span>{inr((i.products.discount_price ?? i.products.price) * i.quantity)}</span>
              </div>
            ))}
            <div className="my-2 border-t border-border" />
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-primary"><span>Coupon</span><span>− {inr(discount)}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "FREE" : inr(shipping)}</span></div>
            <div className="my-2 border-t border-border" />
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span className="text-clay">{inr(total)}</span></div>
          </div>
          <Button className="mt-6 w-full rounded-full" size="lg" onClick={placeOrder} disabled={placing}>
            {placing ? "Placing…" : method === "cod" ? "Place order (COD)" : "Place order"}
          </Button>
        </aside>
      </div>
    </div>
  );
}
function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return <div><Label className="text-xs text-muted-foreground">{label}</Label><Input value={v} onChange={(e) => on(e.target.value)} className="mt-1" /></div>;
}
function PayOption({ value, id, title, desc, checked }: any) {
  return (
    <label htmlFor={id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${checked ? "border-primary bg-primary/5" : "border-border"}`}>
      <RadioGroupItem value={value} id={id} className="mt-1" />
      <div><div className="font-medium">{title}</div><div className="text-xs text-muted-foreground">{desc}</div></div>
    </label>
  );
}
