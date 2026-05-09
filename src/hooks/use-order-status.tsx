import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { OrderStatus } from "@/components/site/OrderTimeline";

/** Subscribes to a single order's status via Supabase Realtime. */
export function useOrderStatus(orderId: string | undefined, initial?: OrderStatus) {
  const [status, setStatus] = useState<OrderStatus | undefined>(initial);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    supabase.from("orders").select("status").eq("id", orderId).maybeSingle().then(({ data }) => {
      if (!cancelled && data?.status) setStatus(data.status as OrderStatus);
    });
    const channel = supabase
      .channel(`order-${orderId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload) => setStatus((payload.new as any).status as OrderStatus))
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [orderId]);

  return status;
}
