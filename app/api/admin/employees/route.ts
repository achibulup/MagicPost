import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import type { AccountData } from '@/lib/backend/database/definitions';

type ManagerForm = {
  name: string;
  email: string;
  phone: string;
  facility: string;
};

export async function GET(req: Request) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const managers = await actions.getEmployees({
    role: 'manager'
  });
  return NextResponse.json(managers);
}

export async function POST(req: Request) {
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
  const { name, email, phone, facility } = jsonObject as ManagerForm;
  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: 'Invalid data' },
      { status: 400 }
    );
  }
  const pickup = (await actions.getPickupPointByName(facility))?.id;
  const transit = (await actions.getTransitHubByName(facility))?.id;
  if (!pickup && !transit) {
    return NextResponse.json(
      { error: 'Invalid facility' },
      { status: 400 }
    );
  }
  if (pickup && transit) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
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
      role: 'manager',
      pickupPoint: pickup ? Number(pickup) : null,
      transitHub: transit ? Number(transit) : null
    } as AccountData);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}