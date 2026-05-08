import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Leaf, ShoppingBag, User as UserIcon, Menu, X, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const nav = useNavigate();

  useEffect(() => {
    if (!user) { setCount(0); return; }
    const load = async () => {
      const { data } = await supabase.from("cart_items").select("quantity").eq("user_id", user.id);
      setCount(data?.reduce((s, i) => s + i.quantity, 0) ?? 0);
    };
    load();
    const ch = supabase.channel("cart-h").on("postgres_changes", { event: "*", schema: "public", table: "cart_items", filter: `user_id=eq.${user.id}` }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const links = [
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "Our Story" },
    { to: "/blog", label: "Wisdom" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">Vaidya & Co.</div>
            <div className="font-hindi -mt-1 text-[10px] text-muted-foreground">वैद्य एंड कंपनी</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary [&.active]:text-primary">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => nav({ to: "/shop" })} aria-label="Search"><Search className="size-5" /></Button>
          <Link to="/cart" className="relative grid size-10 place-items-center rounded-md hover:bg-muted">
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-turmeric text-[10px] font-bold text-turmeric-foreground">{count}</span>
            )}
          </Link>
          {user ? (
            <>
              <Link to="/account" className="hidden md:grid size-10 place-items-center rounded-md hover:bg-muted"><UserIcon className="size-5" /></Link>
              {isAdmin && <Link to="/admin" className="hidden md:inline-flex"><Button size="sm" variant="outline">Admin</Button></Link>}
              <Button size="sm" variant="ghost" onClick={() => signOut()} className="hidden md:inline-flex">Sign out</Button>
            </>
          ) : (
            <Link to="/login" className="hidden md:inline-flex"><Button size="sm" variant="default">Sign in</Button></Link>
          )}
          <button className="md:hidden grid size-10 place-items-center rounded-md hover:bg-muted" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-base font-medium">{l.label}</Link>
            ))}
            {user ? (
              <>
                <Link to="/account" onClick={() => setOpen(false)} className="py-2">My Account</Link>
                {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="py-2">Admin</Link>}
                <button onClick={() => { signOut(); setOpen(false); }} className="py-2 text-left">Sign out</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="py-2">Sign in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
