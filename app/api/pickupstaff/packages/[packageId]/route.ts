import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import { NextApiRequest, NextApiResponse } from 'next';
import { notFound } from 'next/navigation';
import type { Order } from '@/lib/database/definitions';
import { NextResponse } from 'next/server';
import { isPackageManipulable } from '../../utils';


export async function GET(req: Request, { params }: { params: { packageId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.pickupPoint == null) {
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
  return NextResponse.json(pk);
}

// handle request to update package's status
export async function PATCH(req: Request, { params }: { params: { packageId: string }}) {
  try {
    const user = await getUserProfile();
    if (!user || user.role !== 'staff' || user.pickupPoint == null) {
      throw ['Unauthorized', 401];
    }
    if (req.headers.get('content-type') !== 'application/json') {
      throw ['Invalid content type', 400];
    }
    const { status } = await req.json();
    if (!status) {
      throw ['Invalid request', 400];
    }
    if (!(status in ['pending', 'delivering1', 'delivering2', 'delivered'])) {
      throw ['Invalid status', 400];
    }
    const pk = await actions.getPackageById(Number(params.packageId));
    if (!pk || (pk.pickupFrom !== user.pickupPoint && pk.pickupTo !== user.pickupPoint)) {
      throw ['Package not found', 404];
    }
    if (pk.pickupFrom === user.pickupPoint) {
      if (status !== 'delivering1' || pk.status !== 'pending') {
        throw ['Not applicable', 400];
      }
    } else {
      if (status !== 'delivered' || pk.status !== 'delivering3') {
        throw ['Not applicable', 400];
      }
    }
    try {
      if (pk.pickupFrom === user.pickupPoint) {
        await actions.packageDelivering1(Number(params.packageId), new Date());
      } else {
        await actions.packageDelivered(Number(params.packageId), new Date());
      }
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