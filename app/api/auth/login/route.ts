import { NextResponse } from 'next/server';
import { setAuthCookie } from '@/lib/auth/session';
import * as actions from '@/lib/database/actions';
import type { Session } from '@/lib/auth/session';
import { authenticate, clearAuthCookie, getUserProfile } from '@/lib/auth/session';

type LoginForm = {
    email: string;
    password: string;
}

export async function POST(req: Request) {
    const content_type = req.headers.get('content-type');
    if (!content_type || !content_type.startsWith('multipart/form-data')) {
        console.log(content_type);
        return NextResponse.json({ error: 'Invalid data'}, { status: 400 });
    }
    const formdata = await req.formData();
    const jsonObject: { [key: string]: any } = {};
    for (const [key, value] of formdata.entries()) {
        jsonObject[key] = value;
    }
    if (jsonObject.email === undefined || jsonObject.password === undefined) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }
    const data = jsonObject as LoginForm;
    const session = await authenticate(data.email, data.password);
    if (!session || session.status === 'inactive') {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }
    await setAuthCookie(session);
    return NextResponse.json(session);
}