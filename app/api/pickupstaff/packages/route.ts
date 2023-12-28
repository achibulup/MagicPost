import { NextApiRequest, NextApiResponse } from 'next';
import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import { NextResponse } from 'next/server';
import type { Package, PackageData } from '@/lib/database/definitions';
import { canAddOrder } from '../utils';

export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const url = new URL(req.url!);
  const status = url.searchParams.get('status');
  const fromTo = url.searchParams.get('fromTo') ?? 'both';
  const packages = await actions.getPackages({
    status: status ? status : undefined,
    pickup: fromTo === 'both' ? user.pickupPoint : undefined,
    pickupFrom: fromTo === 'from' ? user.pickupPoint : undefined,
    pickupTo: fromTo === 'to' ? user.pickupPoint : undefined
  });
  return NextResponse.json(packages);
}

export async function POST(req: Request) {
  try {
    const user = await getUserProfile();
    if (!user || user.role !== 'staff' || user.pickupPoint == null) {
      throw ['Unauthorized', 401];
    }
    const contentType = req.headers.get('content-type');
    if (!contentType || contentType !== 'application/json') {
      throw ['Invalid content type', 400];
    }
    const { orders, shipper } = await req.json() as { orders: number[], shipper?: number };
    if (!Array.isArray(orders)) {
      throw ['Invalid data', 400];
    }
    if (orders.length === 0) {
      throw ['orders must not be empty', 400];
    }
    const ordersdata = await Promise.all(orders.map(async (id) => { return actions.getOrderById(id) }));
    const pickupTo = ordersdata[0].pickupTo;
    for (const order of ordersdata) {
      const canAdd = canAddOrder(user.pickupPoint, pickupTo, order, user);
      if (canAdd !== true) {
        throw canAdd;
      }
    }
    const pk: PackageData = {
      pickupFrom: user.pickupPoint,
      pickupTo: pickupTo,
    };
    try {
      const pkid = (await actions.createPackage(pk));
      await Promise.all(orders.map(async (id) => { return actions.addOrderToPackage(id, pkid) }));
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