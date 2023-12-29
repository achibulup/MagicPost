import { Session } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { Order } from '@/lib/database/definitions';

export async function getOrderWithHubs(orderId: number, hub: number) {
  const orders = (await actions.getOrders({
    id: orderId,
    hub
  }));
  if (orders.length === 0) {
    return undefined;
  }
  return orders[0] as Order & { hubFrom: number, hubTo: number };
}

export function isVisibleTo(order: Order & { hubFrom: number, hubTo: number }, staff: Session) {
  return (
    (order.hubFrom === staff.transitHub && order.status in [3, 4])
  ||(order.pickupTo === staff.transitHub && order.status in [5, 6])
  );
}

// export function canAddOrder(pickupFrom: number, pickupTo: number, order?: Order, staff?: Session): true | [string, number] {
//   if (!staff || staff.role !== 'staff' || staff.pickupPoint == null) {
//     return ['Unauthorized', 401];
//   }
//   if (!order || (order.pickupFrom !== staff.pickupPoint && order.pickupTo !== staff.pickupPoint)) {
//     return ['Order not found', 404];
//   }
//   if (order.pickupFrom !== staff.pickupPoint) {
//     return ['Unauthorized', 401];
//   }
//   if (order.package) {
//     return ['Order already in package', 400];
//   }
//   if (order.pickupFrom != pickupFrom || order.pickupTo !== pickupTo) {
//     return ['Order not in pickup point', 400];
//   }
//   return true;
// }

// export function isPackageManipulable(pk?: Package, staff?: Session): true | [string, number] {
//   if (!staff || staff.role !== 'staff' || staff.pickupPoint == null) {
//     return ['Unauthorized', 401];
//   }
//   if (!pk || (pk.pickupFrom !== staff.pickupPoint && pk.pickupTo !== staff.pickupPoint)) {
//     return ['Package not found', 404];
//   }
//   if (pk.pickupFrom !== staff.pickupPoint) {
//     return ['Unauthorized', 401];
//   }
//   if (pk.status !== 'pending') {
//     return ['Package already picked up', 400];
//   }
//   return true;
// }