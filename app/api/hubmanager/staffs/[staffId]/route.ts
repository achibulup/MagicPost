import * as actions from '../../../../../lib/database/actions';
import { getUserProfile } from '../../../../../lib/auth/session';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { staffId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'manager' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const staff = await actions.getAccountById(Number(params.staffId));
  if (!staff || staff.transitHub !== user.transitHub) {
    return NextResponse.json(
      { error: 'Staff not found' },
      { status: 404 }
    );
  }
  const staffInfo = {
    id: staff.id,
    name: staff.name,
    phone: staff.phone,
    status: staff.status,
    role: staff.role
  }
  return NextResponse.json(staffInfo);
}

export async function PATCH(req: Request, { params }: { params: { staffId: string }}) {
  const user = await getUserProfile();
  if (!user || user.role !== 'manager' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  if (req.headers.get('content-type') !== 'application/json') {
    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 400 }
    );
  }
  const { status } = await req.json();
  if (!status || !(status in ['active', 'inactive'])) {
    return NextResponse.json(
      { error: 'Invalid status' },
      { status: 400 }
    );
  }
  const staff = await actions.getAccountById(Number(params.staffId));
  if (!staff || staff.transitHub !== user.transitHub) {
    return NextResponse.json(
      { error: 'Staff not found' },
      { status: 404 }
    );
  }
  if (staff.status === status) {
    return NextResponse.json(
      { error: 'Same status' },
      { status: 400 }
    );
  }
  try {
    await actions.setAccountStatus(Number(params.staffId), status);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 

// export async function DELETE(req: Request, { params }: { params: { staffId: string }}) {

// }