import { NextResponse } from 'next/server';
import { getUserProfile } from '../../../../lib/auth/session';
import * as actions from '../../../../lib/database/actions';
import type { AccountData } from '../../../../lib/database/definitions';

type StaffForm = AccountData;

export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'manager' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const employees = await actions.getEmployees({
    pickupPoint: user.pickupPoint
  });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const user = await getUserProfile();
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
  const { name, email, password, phone, role } = jsonObject as StaffForm;
  const check = await actions.getAccountByEmail(email);
  if (check) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 400 }
    );
  }
  try {
    await actions.createAccount({
      name,
      email,
      password,
      phone,
      role: role as 'staff' | 'manager',
      pickupPoint: user.pickupPoint,
      transitHub: null,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}