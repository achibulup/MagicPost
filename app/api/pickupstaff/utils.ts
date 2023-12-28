import { Session } from '@/lib/auth/session';
import * as actions from '../../../lib/database/actions';
import type { Order, Account, Package } from '../../../lib/database/definitions';

export function canAddOrder(pickupFrom: number, pickupTo: number, order?: Order, staff?: Session): true | [string, number] {
  if (!staff || staff.role !== 'staff' || staff.pickupPoint == null) {
    return ['Unauthorized', 401];
  }
  if (!order || (order.pickupFrom !== staff.pickupPoint && order.pickupTo !== staff.pickupPoint)) {
    return ['Order not found', 404];
  }
  if (order.pickupFrom !== staff.pickupPoint) {
    return ['Unauthorized', 401];
  }
  if (order.package) {
    return ['Order already in package', 400];
  }
  if (order.pickupFrom != pickupFrom || order.pickupTo !== pickupTo) {
    return ['Order not in pickup point', 400];
  }
  return true;
}

export function isPackageManipulable(pk?: Package, staff?: Session): true | [string, number] {
  if (!staff || staff.role !== 'staff' || staff.pickupPoint == null) {
    return ['Unauthorized', 401];
  }
  if (!pk || (pk.pickupFrom !== staff.pickupPoint && pk.pickupTo !== staff.pickupPoint)) {
    return ['Package not found', 404];
  }
  if (pk.pickupFrom !== staff.pickupPoint) {
    return ['Unauthorized', 401];
  }
  if (pk.status !== 'pending') {
    return ['Package already picked up', 400];
  }
  return true;
}