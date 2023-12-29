import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { AccountData } from '@/lib/database/definitions';


export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'director') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
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
}
