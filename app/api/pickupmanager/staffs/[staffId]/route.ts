import * as actions from '@/lib/database/actions';
import { getUserProfile } from '@/lib/auth/session';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { staffId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'manager' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const staff = await actions.getAccountById(Number(params.staffId));
  if (!staff || staff.pickupPoint !== user.pickupPoint) {
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
  const user = await getUserProfile(req);
  if (!user || user.role !== 'manager' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const contentType = req.headers.get('content-type');
  if (!contentType || !contentType.startsWith('multipart/form-data')) {
    return NextResponse.json(
      { error: 'Invalid content type' },
      { status: 400 }
    );
  }
  const formdata = await req.formData();
  const jsonObject: { [key: string]: any } = {};
  for (const [key, value] of formdata.entries()) {
    jsonObject[key] = value;
  }
  const { name, email, phone, role } = jsonObject;
  const staff = await actions.getAccountById(Number(params.staffId));
  if (!staff || staff.pickupPoint !== user.pickupPoint) {
    return NextResponse.json(
      { error: 'Staff not found' },
      { status: 404 }
    );
  }
  if (email) {
    const check = await actions.getAccountByEmail(email);
    if (check) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }
  }
  try {
    await actions.updateAccount(Number(params.staffId), {
      name,
      email,
      phone,
      role
    });
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