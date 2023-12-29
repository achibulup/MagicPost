import type { Order } from "@/lib/database/definitions";
import type { Session } from "@/lib/auth/session";

export function visibleToShipper(order: Order, user: Session) {
  return !!order && order.pickupTo === user.pickupPoint
    && (order.shipper === user.id || order.status === 9);
}