import { NextResponse } from 'next/server';
import * as actions from '@/lib/backend/database/actions';

type SignupForm = {
    email: string;
    password: string;
    name: string;
    phone: string;
}

type ResponseData = {
    success?: boolean;
    error?: string;
}

export async function POST(req: Request) {
    const content_type = req.headers.get('content-type');
    if (!content_type || !content_type.startsWith('multipart/form-data')) {
        // console.log(content_type);
        return NextResponse.json({ error: 'Invalid data'}, { status: 400 });
    }
    const formdata = await req.formData();
    const jsonObject: { [key: string]: any } = {};
    for (const [key, value] of formdata.entries()) {
        jsonObject[key] = value;
    }
    const data = {
      ...(jsonObject as SignupForm),
      role: 'customer' as const
    };
    const search = await actions.getAccountByEmail(data.email);
    if (search) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    try {
      await actions.createAccount(data);
      return NextResponse.json({ success: true }, { status: 201 });
    } catch (err) {
      return NextResponse.json({ error: 'some error occurred' }, { status: 400 });
    }
}