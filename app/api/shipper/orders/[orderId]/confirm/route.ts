import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import { NextResponse } from 'next/server';
import { visibleToShipper } from '../../../utils';

export async function POST(req: Request, { params }: { params: { orderId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'shipper') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const order = await actions.getOrderById(Number(params.orderId));
  if (!order || !visibleToShipper(order, user)) {
    return NextResponse.json(
      { error: 'Order not found or accepted by other shipper' },
      { status: 404 }
    );
  }
  if (order.status !== 10) {
    return NextResponse.json(
      { error: 'Invalid confirm' },
    );
  }
  try {
    await actions.orderDelivered(Number(params.orderId), new Date());
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}