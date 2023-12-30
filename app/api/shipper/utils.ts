import type { Order } from "@/lib/backend/database/definitions";
import type { Session } from "@/lib/backend/auth/session";

export function visibleToShipper(order: Order, user: Session) {
  return !!order && order.pickupTo === user.pickupPoint
    && (order.shipper === user.id || order.status === 9);
}