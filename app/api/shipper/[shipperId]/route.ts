import type { Account } from '@/lib/backend/database/definitions';
import { NextResponse } from 'next/server';
import * as actions from '@/lib/backend/database/actions';
import { getUserProfile } from '@/lib/backend/auth/session';

export async function GET(req: Request, { params }: { params: { shipperId: string }}) {
  const user = await getUserProfile(req);
  const acc = await actions.getAccountById(Number(params.shipperId));
  if (!acc || acc.role !== 'shipper') {
    return NextResponse.json(
      { error: 'Shipper not found' },
      { status: 404 }
    );
  }
  if (acc.status == 'inactive' && (!user || user.role === 'customer')) {
    return NextResponse.json(
      { error: 'Shipper not found' },
      { status: 404 }
    );
  }
  const shipperInfo = {
    id: acc.id,
    name: acc.name,
    phone: acc.phone,
    status: user && user.role !== 'customer' ? acc.status : undefined
  }
  return NextResponse.json(shipperInfo);
}