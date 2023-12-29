import type { Order } from './definitions'

export function statusString(order: Order) {
  if (order.status != Math.floor(order.status)) return 'Invalid';
  if (order.status === -1) return 'Cancelled';
  if (order.status === 11) return 'Delivered';
  if (order.status === 10) return 'Delivering';
  if (order.status === 9) return 'PendingDeliver';
  if (order.status === 8) return 'Transported';
  if (order.status >= 2 && order.status <= 8) {
    if (order.status % 2 === 0) return 'In pickup point';
    else return 'In transit';
  }
}