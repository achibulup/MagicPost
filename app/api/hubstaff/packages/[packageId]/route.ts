import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import { NextApiRequest, NextApiResponse } from 'next';
import { notFound } from 'next/navigation';
import type { Order, Package } from '@/lib/database/definitions';
import { NextResponse } from 'next/server';


export async function GET(req: Request, { params }: { params: { packageId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'staff' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const pks = await actions.getPackages({ 
    id: Number(params.packageId),
    hub: user.transitHub
  });
  if (pks.length == 0) {
    return NextResponse.json(
      { error: 'Package not found' },
      { status: 404 }
    );
  }
  return NextResponse.json(pks[0]);
}

// handle request to update package's status
export async function PATCH(req: Request, { params }: { params: { packageId: string }}) {
  try {
    const user = await getUserProfile();
    if (!user || user.role !== 'staff' || user.transitHub == null) {
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
    const pk = (await actions.getPackages({
      id: Number(params.packageId),
      hub: user.transitHub
    }))[0] as (Package & { hubFrom: number, hubTo: number }) | undefined;
    if (!pk || (pk.hubFrom !== user.transitHub && pk.hubTo !== user.transitHub)) {
      throw ['Package not found', 404];
    }
    if (pk.hubFrom === user.transitHub) {
      if (pk.status !== 'delivering1' || status !== 'delivering2') {
        throw ['Not applicable', 400];
      }
    } else {
      if (pk.status !== 'delivering2' || status !== 'delivering3') {
        throw ['Not applicable', 400];
      }
    }
    try {
      if (pk.hubFrom === user.transitHub) {
        await actions.packageDelivering2(Number(params.packageId));
      } else {
        await actions.packageDelivering3(Number(params.packageId));
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