import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import { Order } from '@/lib/database/definitions';
import { NextResponse } from 'next/server';

type Result = Order[] | { error: string }; 

export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'shipper') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const status = new URL(req.url!).searchParams.get('status');
  if (status && !(status in ['transported', 'delivering', 'delivered', 'cancelled'])) {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }
  if (!status) {
    const orders = await actions.getOrders({ shipper: user.id });
    return NextResponse.json(orders);
  } else if (status === 'transported') {
    const orders = await actions.getOrders({ 
      pickupTo: user.pickupPoint,
      status: 9
    })
    return NextResponse.json(orders);
  } else if (status === 'delivering') {
    const orders = await actions.getOrders({
      status: 10,
      shipper: user.id,
    })
    return NextResponse.json(orders);
  } else if (status === 'delivered') {
    const orders = await actions.getOrders({
      status: 11,
      shipper: user.id,
    })
    return NextResponse.json(orders);
  } else if (status === 'cancelled') {
    const orders = await actions.getOrders({
      status: -1,
      shipper: user.id,
    })
    return NextResponse.json(orders);
  }
}