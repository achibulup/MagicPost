import type { Account } from "@/lib/database/definitions";
import { NextResponse } from "next/server";
import * as actions from '@/lib/database/actions';

export async function GET(req: Request, { params }: { params: { shipperId: string }}) {
  const acc = await actions.getAccountById(Number(params.shipperId));
  if (!acc || acc.role !== 'shipper') {
    return NextResponse.json(
      { error: 'Shipper not found' },
      { status: 404 }
    );
  }
  const shipperInfo = {
    id: acc.id,
    name: acc.name,
    phone: acc.phone
  }
  return NextResponse.json(shipperInfo);
}