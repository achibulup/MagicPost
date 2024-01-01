import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import { NextResponse } from 'next/server';

export type OrderPostData = {
  sender: string;
  weight: number;
  receiverAddress: string;
  receiverNumber: string;
  pickupTo: string;
  charge: number;
}

export async function GET(req: Request) {
  const user = await getUserProfile(req);
  // console.log(user);
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const orders = await actions.getOrders();
  return NextResponse.json(orders);
}