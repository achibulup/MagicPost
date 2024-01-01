import * as actions from '@/lib/backend/database/actions';
import { getUserProfile } from '@/lib/backend/auth/session';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { employeeId: string }}) {
  const user = await getUserProfile(req);
  if (!user || user.role !== 'manager' || user.transitHub == null) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  const employee = await actions.getAccountById(Number(params.employeeId));
  if (!employee || employee.role !== 'staff' || employee.transitHub !== user.transitHub) {
    return NextResponse.json(
      { error: 'Staff not found' },
      { status: 404 }
    );
  }
  const employeeInfo = {
    id: employee.id,
    name: employee.name,
    phone: employee.phone,
    status: employee.status,
    role: employee.role
  }
  return NextResponse.json(employeeInfo);
}

export async function PATCH(req: Request, { params }: { params: { employeeId: string }}) {
  const user = await getUserProfile(req);
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
  const { name, email, phone, role } = jsonObject;
  const employee = await actions.getAccountById(Number(params.employeeId));
  // console.log(employee);
  if (!employee || employee.role !== 'staff' || employee.transitHub !== user.transitHub) {
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

// export async function DELETE(req: Request, { params }: { params: { employeeId: string }}) {

// }