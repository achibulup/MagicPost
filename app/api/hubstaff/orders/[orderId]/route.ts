import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { Order } from '@/lib/database/definitions';
import { NextResponse } from 'next/server';
import { getOrderWithHubs, isVisibleTo } from '../../utils';


export async function GET(req: Request, { params }: { params: { orderId: string }}) {
  // console.log("?")
  const user = await getUserProfile(req);
  if (!user || user.role !== 'staff' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  // console.log("hubstafforderid");
  const order = await getOrderWithHubs(Number(params.orderId), user.transitHub);
  // console.log(order);
  if (!order || !isVisibleTo(order, user)) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(order);
}
