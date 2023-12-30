import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import { NextResponse } from 'next/server';
import { visibleToShipper } from '../../utils';


export async function GET(req: Request, { params }: { params: { orderId: string }}) {
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
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(order);
}
