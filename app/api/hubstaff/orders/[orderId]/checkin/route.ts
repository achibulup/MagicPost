import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { Order } from '@/lib/database/definitions';
import { NextResponse } from 'next/server';
import { getOrderWithHubs, isVisibleTo } from '../../../utils';


export async function POST(req: Request, { params }: { params: { orderId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'staff' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const order = await getOrderWithHubs(Number(params.orderId), user.transitHub);
  if (!order || !isVisibleTo(order, user)) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  if (order.hubFrom === user.transitHub) {
    if (order.status !== 3) {
      return NextResponse.json(
        { error: 'Invalid checkin' },
      );
    }
  }
  if (order.hubTo === user.transitHub) {
    if (order.status !== 5) {
      return NextResponse.json(
        { error: 'Invalid checkin' },
      );
    }
  }
  try {
    await actions.setOrderStatus(Number(params.orderId), order.status + 1);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
  return NextResponse.json(order);
}
