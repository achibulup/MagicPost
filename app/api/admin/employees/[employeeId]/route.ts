import * as actions from '@/lib/backend/database/actions';
import { getUserProfile } from '@/lib/backend/auth/session';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { managerId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const manager = await actions.getAccountById(Number(params.managerId));
  if (manager.role !== 'manager') {
    return NextResponse.json(
      { error: 'manager not found' },
      { status: 404 }
    );
  }
  const managerInfo = {
    id: manager.id,
    name: manager.name,
    phone: manager.phone,
    status: manager.status,
    role: manager.role
  }
  return NextResponse.json(managerInfo);
}

export async function PATCH(req: Request, { params }: { params: { employeeId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'admin') {
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
  const { name, email, phone } = jsonObject;
  const staff = await actions.getAccountById(Number(params.employeeId));
  if (!staff || staff.transitHub !== user.transitHub) {
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
    await actions.updateAccount(Number(params.employeeId), {
      name: name ? name : undefined,
      email: email ? email : undefined,
      phone: phone ? phone : undefined
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 