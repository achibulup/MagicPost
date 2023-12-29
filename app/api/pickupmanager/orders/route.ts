import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { Order } from '@/lib/database/definitions';
import { NextResponse } from 'next/server';


export async function GET(req: Request, { params }: { params: { orderId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'manager' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const fromTo = new URL(req.url!).searchParams.get('fromto');
  if (fromTo && !(fromTo in ['from', 'to'])) {
    return NextResponse.json(
      { error: 'Invalid fromto' },
      { status: 400 }
    );
  }
  if (!fromTo) {
    const orders = await actions.getOrders({
      pickup: user.pickupPoint
    })
    return NextResponse.json(orders);
  } else if (fromTo === 'from') {
    const orders = await actions.getOrders({
      pickupFrom: user.pickupPoint
    })
    return NextResponse.json(orders);
  } else if (fromTo === 'to') {
    const orders = await actions.getOrders({
      pickupTo: user.pickupPoint
    })
    return NextResponse.json(orders);
  }
}
