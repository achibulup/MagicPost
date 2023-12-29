import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { AccountData } from '@/lib/database/definitions';

type StaffForm = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

export async function GET(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'manager' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const role = new URL(req.url!).searchParams.get('role');
  if (role && role !== 'staff') {
    return NextResponse.json(
      { error: 'Invalid role' },
      { status: 400 }
    );
  }
  const employees = await actions.getEmployees({
    transitHub: user.transitHub,
    role: role ? role as 'staff': undefined
  });
  return NextResponse.json(employees);
}

export async function POST(req: Request) {
  const user = await getUserProfile();
  if (!user || user.role !== 'manager' || user.transitHub == null) {
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
  const check = await actions.getAccountByEmail(email);
  if (check) {
    return NextResponse.json(
      { error: 'Email already exists' },
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
      role: role as 'staff' | 'manager',
      pickupPoint: null,
      transitHub: user.transitHub,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}