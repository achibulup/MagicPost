import { NextApiRequest, NextApiResponse } from 'next';
import { notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { OrderFilter } from '@/lib/database/actions';
import { NextResponse } from 'next/server';

type OrderPostData = {
  sender: number;
  weight: number;
  receiverAddress: string;
  receiverNumber: string;
  pickupTo: number;
  charge: number;
}

export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.pickupPoint === null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const url = new URL(req.url!);
  const isPending = url.searchParams.get('pending');
  const fromTo = url.searchParams.get('fromTo') ?? 'both';
  const orders = await actions.getOrders({
    status: isPending ? (isPending === 'true' ? 'pending' : 'delivered') : undefined,
    pickup: fromTo === 'both' ? user.pickupPoint : undefined,
    pickupFrom: fromTo === 'from' ? user.pickupPoint : undefined,
    pickupTo: fromTo === 'to' ? user.pickupPoint : undefined
  } as OrderFilter);
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.pickupPoint === null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const contentType = req.headers.get('content-type');
  if (!contentType || contentType.startsWith('multipart/form-data')) {
    return NextResponse.json(
      { error: 'Invalid data' },
      { status: 400 }
    );
  }
  const formdata = await req.formData();
  const jsonObject: { [key: string]: any } = {};
  for (const [key, value] of formdata.entries()) {
    jsonObject[key] = value;
  }
  const data = jsonObject as OrderPostData;
  const orderData = {
    sender: data.sender,
    weight: data.weight,
    receiverAddress: data.receiverAddress,
    receiverNumber: data.receiverNumber,
    pickupFrom: user.pickupPoint,
    pickupTo: data.pickupTo,
    charge: data.charge,
    sendDate: new Date()
  }
  try {
    await actions.createOrder(orderData);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}