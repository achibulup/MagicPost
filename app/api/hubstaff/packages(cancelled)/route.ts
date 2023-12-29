import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'staff' || user.transitHub == null) {
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
    pickup: fromTo === 'both' ? user.transitHub : undefined,
    hubFrom: fromTo === 'from' ? user.transitHub : undefined,
    hubTo: fromTo === 'to' ? user.transitHub : undefined
  });
  return NextResponse.json(packages);
}

