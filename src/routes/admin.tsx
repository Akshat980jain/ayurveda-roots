import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminLayout });

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/add-product", label: "Add product", icon: PlusCircle },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

function AdminLayout() {
  const { user, isAdmin, loading } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => { if (!loading && (!user || !isAdmin)) nav({ to: "/" }); }, [user, isAdmin, loading, nav]);

  if (loading || !isAdmin) return <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">Loading…</div>;

  const isActive = (to: string, exact?: boolean) => exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/30">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-8">
        <aside className="hidden w-60 shrink-0 md:block">
          <div className="sticky top-20 rounded-2xl border border-border/60 bg-card p-3 shadow-soft">
            <div className="px-3 pb-3 pt-2">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Admin</div>
              <div className="mt-0.5 font-display text-lg font-semibold">Vaidya & Co.</div>
            </div>
            <nav className="space-y-1">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = isActive(n.to, n.exact);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary"
                    )}
                  >
                    <Icon className="size-4" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-3 border-t border-border/60 pt-3">
              <Link to="/" className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
                <ArrowLeft className="size-4" />
                Back to store
              </Link>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">
            {NAV.map((n) => {
              const active = isActive(n.to, n.exact);
              return (
                <Link key={n.to} to={n.to} className={cn("whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-medium", active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card")}>
                  {n.label}
                </Link>
              );
            })}
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
