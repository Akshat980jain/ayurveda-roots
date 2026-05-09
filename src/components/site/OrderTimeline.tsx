import { Check, Clock, Package, Truck, Home, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const STEPS: { key: OrderStatus; label: string; hindi: string; Icon: any }[] = [
  { key: "pending",   label: "Order placed", hindi: "ऑर्डर मिला",     Icon: Clock },
  { key: "confirmed", label: "Confirmed",    hindi: "पुष्टि",          Icon: Check },
  { key: "shipped",   label: "Shipped",      hindi: "भेज दिया",        Icon: Truck },
  { key: "delivered", label: "Delivered",    hindi: "पहुँच गया",       Icon: Home },
];

export function OrderTimeline({ status, className }: { status: OrderStatus; className?: string }) {
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

  return (
    <div className={cn("relative", className)}>
      <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" aria-hidden />
      <div
        className="absolute left-0 top-5 h-0.5 bg-primary transition-all duration-700"
        style={{ width: `${(activeIdx / (STEPS.length - 1)) * 100}%` }}
        aria-hidden
      />
      <ol className="relative flex justify-between">
        {STEPS.map((s, i) => {
          const done = i < activeIdx;
          const current = i === activeIdx;
          const Icon = s.Icon;
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
            </li>
          );
        })}
      </ol>
    </div>
  );
}
