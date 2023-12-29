import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const url = new URL(req.url!);
  const kind = url.searchParams.get('kind'); 
  if (kind && !(kind in ['incoming', 'outgoing'])) {
    return NextResponse.json(
      { error: 'Invalid kind' },
      { status: 400 }
    );
  }
  if (!kind) {
    const orders = await actions.getOrdersByHub(user.transitHub);
    return NextResponse.json(orders);
  } else if (kind === 'incoming') {
    const orders = await actions.getOrdersByHub(user.transitHub, kind);
    return NextResponse.json(orders);
  } else if (kind === 'outgoing') {
    const orders = await actions.getOrdersByHub(user.transitHub, kind);
    return NextResponse.json(orders);
  }
}