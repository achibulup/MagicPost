import { NextApiRequest, NextApiResponse } from 'next';
import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'customer') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const status = new URL(req.url!).searchParams.get('status');
  if (status && !(status in ['transporting', 'delivering', 'delivered', 'cancelled'])) {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }
  if (!status) {
    const orders = await actions.getOrders({ sender: user.id });
    return NextResponse.json(orders);
  } else if (status === 'transporting') {
    const orders = await actions.getTransportingOrders(user.id);
    return NextResponse.json(orders);
  } else if (status === 'delivering') {
    const orders = await actions.getDeliveringOrders(user.id);
    return NextResponse.json(orders);
  } else if (status === 'delivered') {
    const orders = await actions.getDeliveredOrders(user.id);
    return NextResponse.json(orders);
  } else if (status === 'cancelled') {
    const orders = await actions.getCancelledOrders(user.id);
    return NextResponse.json(orders);
  }
}
