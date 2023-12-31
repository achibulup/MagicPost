import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import type { AccountData, PickupPoint, TransitHub } from '@/lib/backend/database/definitions';

export type PickupPointInfo = {kind: 'pickup', incoming: number, outgoing: number} & PickupPoint;
export type TransitHubInfo = {kind: 'hub', incoming: number, outgoing: number} & TransitHub;
export type Hubs = { pickupPoints: PickupPointInfo[], transitHubs: TransitHubInfo[] }

export async function GET(req: Request) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  try {
     const pickupPoints = await Promise.all(
    (await actions.getAllPickupPoints()).map(async (point) => {
      const [incoming, outgoing] = 
        await Promise.all([actions.getIncomingOrdersByPickupPoint(point.id),
                           actions.getOutgoingOrdersByPickupPoint(point.id)]);
      return { ...point, incoming, outgoing, kind: 'pickup' }
    })
  );
  const transitHubs = await Promise.all(
    (await actions.getAllTransitHubs()).map(async (hub) => {
      const [incoming, outgoing] = 
        await Promise.all([actions.getIncomingOrdersByHub(hub.id),
                           actions.getOutgoingOrdersByHub(hub.id)]);
      return { ...hub, incoming, outgoing, kind: 'hub' }
    })
  );
  return NextResponse.json({ pickupPoints, transitHubs });
  } catch (err) {
    // console.log(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
