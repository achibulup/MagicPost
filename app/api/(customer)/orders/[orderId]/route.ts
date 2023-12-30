import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import { notFound } from 'next/navigation';
import type { Order } from '@/lib/backend/database/definitions';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { orderId: string } }) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'customer') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const order = await actions.getOrderById(Number(params.orderId));
  if (!order || order.sender !== user.id) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(order);
}