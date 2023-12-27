import { getUserProfile } from "@/lib/auth/session";
import * as actions from '@/lib/database/actions';
import { NextApiRequest, NextApiResponse } from "next";
import { notFound } from "next/navigation";
import type { Order } from "@/lib/database/definitions";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { orderId: string }}) {
    const user = await getUserProfile();
    if (!user || user.role !== 'shipper') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
    }
    const order = await actions.getOrderById(Number(params.orderId));
    if (!order || order.shipper !== user.id) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
    }
    return NextResponse.json(order);
}

// handle request to update order status
export async function PATCH(req: Request, { params }: { params: { orderId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'shipper') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
  }
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 400 }
    );
  }
  const { status } = await req.json();
  if (!status || status !== 'delivered') {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }
  const order = await actions.getOrderById(Number(params.orderId));
  if (!order || order.shipper !== user.id) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
  }
  if (order.status !== 'delivered') {
    return NextResponse.json(
      { error: 'Order already delivered' },
      { status: 400 }
    );
  }
  try {
    await actions.orderDelivered(Number(params.orderId), new Date());
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}