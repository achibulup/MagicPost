import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import type { Order } from '@/lib/backend/database/definitions';
import { NextResponse } from 'next/server';


export async function GET(req: Request, { params }: { params: { orderId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const order = await actions.getOrderById(Number(params.orderId));
  if (!order) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(order);
}
