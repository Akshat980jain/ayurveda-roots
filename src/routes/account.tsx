import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inr } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { OrderTimeline, type OrderStatus } from "@/components/site/OrderTimeline";

export const Route = createFileRoute("/account")({ component: Account });

function Account() {
  const { user, loading: al, signOut } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>({ full_name: "", phone: "" });
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    if (!al && !user) nav({ to: "/login" });
    if (!user) return;
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data ?? []));
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => data && setProfile(data));
    supabase.from("wishlist_items").select("*, products(*)").eq("user_id", user.id).then(({ data }) => setWishlist(data ?? []));

    const channel = supabase
      .channel(`orders-${user.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
        (payload) => setOrders((prev) => prev.map((o) => o.id === (payload.new as any).id ? { ...o, ...payload.new } : o)))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, al, nav]);

  if (!user) return null;

  const saveProfile = async () => {
    const { error } = await supabase.from("profiles").update({ full_name: profile.full_name, phone: profile.phone }).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">My account</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </div>
      <Tabs defaultValue="orders" className="mt-8">
        <TabsList><TabsTrigger value="orders">Orders</TabsTrigger><TabsTrigger value="wishlist">Wishlist</TabsTrigger><TabsTrigger value="profile">Profile</TabsTrigger></TabsList>
        <TabsContent value="orders" className="pt-6 space-y-3">
          {orders.length === 0 && <p className="text-muted-foreground">No orders yet. <Link to="/shop" className="text-primary underline">Start shopping</Link>.</p>}
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div><div className="font-mono text-sm">#{o.id.slice(0,8)}</div><div className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</div></div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize">{o.status}</span>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">{(o.items as any[]).map((i) => `${i.name} × ${i.quantity}`).join(", ")}</div>
              <div className="mt-2 font-semibold text-clay">{inr(o.total)}</div>
              <div className="mt-5 border-t border-border/60 pt-5">
                <OrderTimeline status={o.status as OrderStatus} />
              </div>
            </div>
          ))}
        </TabsContent>
        <TabsContent value="wishlist" className="pt-6">
          {wishlist.length === 0 && <p className="text-muted-foreground">Wishlist is empty.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((w) => (
              <Link key={w.id} to="/product/$slug" params={{ slug: w.products.slug }} className="rounded-2xl border border-border/60 bg-card p-4 hover:shadow-soft">
                <div className="font-medium">{w.products.name}</div>
                <div className="text-sm text-clay">{inr(w.products.discount_price ?? w.products.price)}</div>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="profile" className="pt-6">
          <div className="max-w-md space-y-3 rounded-2xl border border-border/60 bg-card p-6">
            <div><Label>Full name</Label><Input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="mt-1" /></div>
            <div><Label>Phone</Label><Input value={profile.phone ?? ""} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="mt-1" /></div>
            <Button onClick={saveProfile}>Save</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
