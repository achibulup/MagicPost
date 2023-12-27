import { getUserProfile } from "@/lib/auth/session";
import * as actions from "@/lib/database/actions";
import { NextApiRequest, NextApiResponse } from "next";
import { notFound } from "next/navigation";
import type { Order } from "@/lib/database/definitions";
import { NextResponse } from "next/server";
import { canAddOrder, isPackageManipulable } from "../../../utils";


export async function GET(req: Request, { params }: { params: { packageId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.pickupPoint === null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const pk = await actions.getPackageById(Number(params.packageId));
  if (!pk || (pk.pickupFrom !== user.pickupPoint && pk.pickupTo !== user.pickupPoint)) {
    return NextResponse.json(
      { error: 'Package not found' },
      { status: 404 }
    );
  }
  const orders = await actions.getOrders({
    package: Number(params.packageId)
  });
  return NextResponse.json(orders);
}

// add order to package
export async function POST(req: Request, { params }: { params: { packageId: string }}) {
  try {
    const user = await getUserProfile();
    if (!user || user.role !== 'staff' || user.pickupPoint === null) {
      throw ['Unauthorized', 401];
    }
    if (req.headers.get('content-type') !== 'application/json') {
      throw ['Invalid content type', 400];
    }
    const orders = await req.json() as number[];
    // check if shipper is a valid number id
    if (!orders || !Array.isArray(orders)) {
      throw ['Invalid data', 400];
    }
    if (orders.length === 0) {
      throw ['orders must not be empty', 400];
    }
    const pk = await actions.getPackageById(Number(params.packageId));
    const canManipulate = isPackageManipulable(pk, user);
    if (canManipulate !== true) {
      throw canManipulate;
    }
    const ordersdata = await Promise.all(orders.map(async (id) => { return actions.getOrderById(id) }));
    for (const order of ordersdata) {
      const canAdd = canAddOrder(user.pickupPoint, pk.pickupTo, order, user);
      if (canAdd !== true) {
        throw canAdd;
      }
    }
    try {
      await Promise.all(orders.map(async (id) => { 
        return actions.addOrderToPackage(id, Number(params.packageId)) 
      }));
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