import type { Account } from '@/lib/database/definitions';
import { NextResponse } from 'next/server';
import * as actions from '@/lib/database/actions';
import { getUserProfile } from '@/lib/auth/session';

export async function GET(req: Request, { params }: { params: { shipperId: string }}) {
  const user = await getUserProfile();
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