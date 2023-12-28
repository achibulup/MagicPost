import { NextApiRequest, NextApiResponse } from 'next';
import { getUserProfile } from '../../../../lib/auth/session';
import * as actions from '../../../../lib/database/actions';
import { notFound } from 'next/navigation';
import type { Order } from '../../../../lib/database/definitions';
import { NextResponse } from 'next/server';


export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'customer') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const status = new URL(req.url!).searchParams.get('status') ?? undefined;
  const orders = await actions.getOrders({
    sender: user.id,
    status: status
  });
  return NextResponse.json(orders);
}
