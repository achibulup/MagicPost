import { NextApiRequest, NextApiResponse } from 'next';
import { notFound } from 'next/navigation';
import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import type { OrderFilter } from '@/lib/backend/database/actions';
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
  if (!user || user.role !== 'staff' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const url = new URL(req.url!);
  const status = url.searchParams.get('status'); 
  if (status && !['incoming', 'outgoing', 'pending-transport', 'pending-delivery'].includes(status)) {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }
  if (!status) {
    const [pendingTransport, incoming, pendingDelivery] = await Promise.all([
      actions.getOrders({
        pickupFrom: user.pickupPoint,
        status: 2
      }),
      actions.getOrders({
        pickupTo: user.pickupPoint,
        status: 7
      }),
      actions.getOrders({
        pickupTo: user.pickupPoint,
        status: 8
      })
    ]);
    const orders = [...pendingTransport, ...incoming, ...pendingDelivery];
    return NextResponse.json(orders);
  } else if (status === 'incoming') {
    const orders = await actions.getOrders({
      pickupTo: user.pickupPoint,
      status: 7
    });
    return NextResponse.json(orders);
  } else if (status === 'outgoing') {
    const [pendingTransport, pendingDelivery] = await Promise.all([
      actions.getOrders({
        pickupFrom: user.pickupPoint,
        status: 2
      }),
      actions.getOrders({
        pickupTo: user.pickupPoint,
        status: 8
      })
    ]);
    const orders = [...pendingTransport, ...pendingDelivery];
    return NextResponse.json(orders);
  } else if (status === 'pending-transport') {
    const orders = await actions.getOrders({
      pickupFrom: user.pickupPoint,
      status: 2
    });
    return NextResponse.json(orders);
  } else if (status === 'pending-delivery') {
    const orders = await actions.getOrders({
      pickupTo: user.pickupPoint,
      status: 8
    });
    return NextResponse.json(orders);
  }
}

export async function POST(req: Request) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'staff' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.startsWith('multipart/form-data')) {
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
  const [sender, pickupTo] = await Promise.all([
    actions.getAccountByEmail(data.sender),
    actions.getPickupPointByName(data.pickupTo)
  ]);
  if (!sender) {
    return NextResponse.json(
      { error: 'Sender not found' },
      { status: 400 }
    );
  }
  if (!pickupTo) {
    return NextResponse.json(
      { error: 'Pickup point not found' },
      { status: 400 }
    );
  }
  const orderData = {
    sender: sender.id,
    weight: data.weight,
    receiverAddress: data.receiverAddress,
    receiverNumber: data.receiverNumber,
    pickupFrom: user.pickupPoint,
    pickupTo: pickupTo.id,
    charge: data.charge,
    sendDate: new Date()
  }
  try {
    await actions.createOrder(orderData);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}