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
  const isPending = new URL(req.url!).searchParams.get('pending');
  const orders = await actions.getOrders({
    shipper: user.id,
    status: isPending ? (isPending != null ? 'delivering' : 'delivered') : undefined
  });
  return NextResponse.json(orders);
}