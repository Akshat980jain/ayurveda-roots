import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus, RefundStatus } from "@/components/site/OrderTimeline";

export type OrderRealtime = {
  status: OrderStatus;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  refund_status: RefundStatus | null;
  refund_updated_at: string | null;
};

/** Subscribes to a single order's status (and cancellation/refund info) via Supabase Realtime. */
export function useOrderStatus(orderId: string | undefined, initial?: Partial<OrderRealtime>) {
  const [data, setData] = useState<Partial<OrderRealtime>>(initial ?? {});

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    supabase.from("orders").select("status, cancellation_reason, cancelled_at, refund_status, refund_updated_at").eq("id", orderId).maybeSingle().then(({ data: d }) => {
      if (!cancelled && d) setData(d as OrderRealtime);
    });
    const channel = supabase
      .channel(`order-${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => {
          const n = payload.new as any;
          setData({ status: n.status, cancellation_reason: n.cancellation_reason, cancelled_at: n.cancelled_at, refund_status: n.refund_status, refund_updated_at: n.refund_updated_at });
        })
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [orderId]);

  return data;
}
