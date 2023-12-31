import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const user = await getUserProfile(req);
  // console.log(user);
  if (!user || user.role !== 'staff' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const url = new URL(req.url!);
  const status = url.searchParams.get('status'); 
  if (status && !['incoming', 'outgoing'].includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }
  if (!status) {
    const orders = await actions.getOrdersByHub(user.transitHub);
    return NextResponse.json(orders);
  } else if (status === 'incoming') {
    const orders = await actions.getOrdersByHub(user.transitHub, status);
    return NextResponse.json(orders);
  } else if (status === 'outgoing') {
    const orders = await actions.getOrdersByHub(user.transitHub, status);
    return NextResponse.json(orders);
  }
}