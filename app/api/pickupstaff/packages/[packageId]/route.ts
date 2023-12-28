import { getUserProfile } from "@/lib/auth/session";
import * as actions from "@/lib/database/actions";
import { NextApiRequest, NextApiResponse } from "next";
import { notFound } from "next/navigation";
import type { Order } from "@/lib/database/definitions";
import { NextResponse } from "next/server";
import { isPackageManipulable } from "../../utils"


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
  return NextResponse.json(pk);
}

// handle request to update order's shipper
export async function PATCH(req: Request, { params }: { params: { packageId: string }}) {
  try {
    const user = await getUserProfile();
    if (!user || user.role !== 'staff' || user.pickupPoint === null) {
      throw ['Unauthorized', 401];
    }
    if (req.headers.get('content-type') !== 'application/json') {
      throw ['Invalid content type', 400];
    }
    const { shipper } = await req.json();
    // check if shipper is a valid number id
    if (!shipper) {
      throw ['Invalid shipper', 400];
    } 
    const shipperProfile = await actions.getAccountById(Number(shipper));
    if (!shipperProfile) {
      throw ['Shipper not found', 400];
    }
    const pk = await actions.getPackageById(Number(params.packageId));
    const canManipulate = isPackageManipulable(pk, user);
    if (canManipulate !== true) {
      throw canManipulate;
    }
    try {
      await actions.setPackageShipper(Number(params.packageId), Number(shipper));
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