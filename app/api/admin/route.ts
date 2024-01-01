import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/backend/auth/session';
import * as actions from '@/lib/backend/database/actions';
import type { AccountData } from '@/lib/backend/database/definitions';

type ManagerForm = {
  name: string;
  email: string;
  phone: string;
};

// export async function POST(req: Request) {
//   const contentType = req.headers.get('content-type');
//   if (!contentType || !contentType.startsWith('multipart/form-data')) {
//     return NextResponse.json(
//       { error: 'Invalid content type' },
//       { status: 400 }
//     );
//   }
//   const formdata = await req.formData();
//   const jsonObject: { [key: string]: any } = {};
//   for (const [key, value] of formdata.entries()) {
//     jsonObject[key] = value;
//   }
//   const { name, email, phone } = jsonObject as ManagerForm;
//   if (!name || !email || !phone) {
//     return NextResponse.json(
//       { error: 'Invalid data' },
//       { status: 400 }
//     );
//   }
//   const check = await actions.getAccountByEmail(email);
//   if (check) {
//     return NextResponse.json(
//       { error: 'Email already exists' },
//       { status: 400 }
//     );
//   }
//   const password = "dir";
//   try {
//     await actions.createAccount({
//       name,
//       email,
//       password,
//       phone,
//       role: 'admin'
//     });
//     return NextResponse.json({ success: true });
//   } catch (err) {
//     return NextResponse.json(
//       { error: 'Internal server error' }, 
//       { status: 500 }
//     );
//   }
// }