import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import type { AccountData } from '@/lib/backend/database/definitions';

type StaffForm = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

export async function GET(req: Request) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'manager' || user.pickupPoint == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const role = new URL(req.url!).searchParams.get('role');
  if (role && !['staff', 'shipper'].includes(role)) {
    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    );
  }
  const employees = await actions.getEmployees({
    pickupPoint: user.pickupPoint,
    role: role as 'staff' | 'shipper' | undefined
  });
  return NextResponse.json(employees.filter((employee: AccountData) => employee.role !== 'manager'));
}

export async function POST(req: Request) {
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
  const { name, email, phone, role } = jsonObject as StaffForm;
  if (!name || !email || !phone || !role) {
    return NextResponse.json(
      { error: 'Invalid data' },
      { status: 400 }
    );
  }
  const check = await actions.getAccountByEmail(email);
  if (check) {
    return NextResponse.json(
      { error: 'Email already exists' },
      { status: 400 }
    );
  }
  if (!['staff', 'shipper'].includes(role)) {
    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    );
  }
  const password = "123456";
  try {
    await actions.createAccount({
      name,
      email,
      password,
      phone,
      role: role as 'staff' | 'shipper',
      pickupPoint: user.pickupPoint,
      transitHub: null,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}