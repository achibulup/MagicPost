import { getUserProfile } from "@/lib/auth/session";
import * as actions from '@/lib/database/actions';
import { NextApiRequest, NextApiResponse } from "next";
import { notFound } from "next/navigation";
import type { Order } from "@/lib/database/definitions";
import { NextResponse } from "next/server";


export async function GET(req: Request, { params }: { params: { orderId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.pickupPoint === null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const order = await actions.getOrderById(Number(params.orderId));
  if (!order || (order.pickupFrom !== user.pickupPoint && order.pickupTo !== user.pickupPoint)) {
    return NextResponse.json(
      { error: 'Order not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(order);
}

// handle request to update order's shipper
export async function PATCH(req: Request, { params }: { params: { orderId: string }}) {
  try {
    const user = await getUserProfile();
    if (!user || user.role !== 'staff' || user.pickupPoint === null) {
      throw ['Unauthorized', 401];
    }
    if (req.headers.get('content-type') !== 'application/json') {
      throw ['Invalid content type', 400];
    }
    const { shipper } = await req.json();
    // check if shipper is a valid number id
    if (!shipper) {
      throw ['Invalid shipper', 400];
    } 
    const shipperProfile = await actions.getAccountById(Number(shipper));
    if (!shipperProfile) {
      throw ['Shipper not found', 400];
    }
    const order = await actions.getOrderById(Number(params.orderId));
    if (!order || (order.pickupFrom !== user.pickupPoint && order.pickupTo !== user.pickupPoint)) {
      throw ['Order not found', 404];
    }
    const incharge = order.pickupTo === user.pickupPoint;
    if (!incharge) {
      throw ['Unauthorized', 401];
    }
    const pk = order?.package && await actions.getPackageById(order.package);
    const packageArrived = pk && pk.status === 'delivered';
    if (!packageArrived) {
      throw ['Package not arrived', 400];
    }
    const delivered = order.status === 'delivered';
    if (delivered) {
      throw ['Order already delivered', 400];
    }
    try {
      await actions.setOrderShipper(Number(params.orderId), Number(shipper));
      return NextResponse.json({ success: true });
    } catch (err) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  } catch (fail) {
    const [err, status] = fail as [string, number];
    return NextResponse.json(
      { error: err },
      { status: status }
    );
  }
}