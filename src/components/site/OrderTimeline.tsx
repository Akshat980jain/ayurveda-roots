import { Check, Clock, Package, Truck, Home, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const STEPS: { key: OrderStatus; label: string; hindi: string; Icon: any; offsetDays: number }[] = [
  { key: "pending",   label: "Order placed", hindi: "ऑर्डर मिला",     Icon: Clock, offsetDays: 0 },
  { key: "confirmed", label: "Confirmed",    hindi: "पुष्टि",          Icon: Check, offsetDays: 1 },
  { key: "shipped",   label: "Shipped",      hindi: "भेज दिया",        Icon: Truck, offsetDays: 2 },
  { key: "delivered", label: "Delivered",    hindi: "पहुँच गया",       Icon: Home,  offsetDays: 5 },
];

const DATE_FMT = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

function windowFor(base: Date, offsetDays: number, isPlaced: boolean) {
  if (isPlaced) {
    const time = base.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
    return { date: DATE_FMT.format(base), window: time };
  }
  const start = new Date(base.getTime() + offsetDays * 86400000);
  const end = new Date(base.getTime() + (offsetDays + 1) * 86400000);
  return { date: DATE_FMT.format(start), window: `${DATE_FMT.format(start)} – ${DATE_FMT.format(end)}` };
}

export function OrderTimeline({ status, createdAt, className }: { status: OrderStatus; createdAt?: string | Date; className?: string }) {
  if (status === "cancelled") {
    return (
      <div className={cn("flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4", className)}>
        <XCircle className="size-6 text-destructive" />
        <div>
          <div className="font-medium text-destructive">Order cancelled</div>
          <div className="text-xs text-muted-foreground">यह ऑर्डर रद्द कर दिया गया है</div>
        </div>
      </div>
    );
  }

  const activeIdx = STEPS.findIndex((s) => s.key === status);
  const base = createdAt ? new Date(createdAt) : null;

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" aria-hidden />
      <div
        className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-700"
        style={{ width: `${(activeIdx / (STEPS.length - 1)) * 100}%` }}
        aria-hidden
      />
      <ol className="relative flex justify-between gap-2">
        {STEPS.map((s, i) => {
          const done = i < activeIdx;
          const current = i === activeIdx;
          const Icon = s.Icon;
          const eta = base ? windowFor(base, s.offsetDays, i === 0) : null;
          return (
            <li key={s.key} className="flex flex-1 flex-col items-center text-center">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border-2 bg-background transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  current && "border-primary text-primary ring-4 ring-primary/15",
                  !done && !current && "border-border text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className={cn("mt-2 text-xs font-medium", (done || current) ? "text-foreground" : "text-muted-foreground")}>{s.label}</div>
              <div className="font-hindi text-[10px] text-muted-foreground">{s.hindi}</div>
              {eta && (
                <div className="mt-1.5 leading-tight">
                  <div className={cn("text-[11px] font-medium", (done || current) ? "text-foreground" : "text-muted-foreground")}>
                    {i === 0 ? eta.date : `Est. ${eta.date}`}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{eta.window}</div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
