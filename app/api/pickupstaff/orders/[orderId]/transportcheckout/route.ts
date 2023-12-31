import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import type { Order } from '@/lib/backend/database/definitions';
import { NextResponse } from 'next/server';
import { isVisibleTo } from '../../../utils';


export async function POST(req: Request, { params }: { params: { orderId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'staff' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const order = await actions.getOrderById(Number(params.orderId));
  if (!order || !isVisibleTo(order, user)) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  if (order.pickupFrom != user.pickupPoint || order.status !== 2) {
    return NextResponse.json(
      { error: 'Invalid checkout' },
      { status: 400 }
    );
  }
  try {
    await actions.setOrderStatus(Number(params.orderId), 3);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  return NextResponse.json(order);
}
