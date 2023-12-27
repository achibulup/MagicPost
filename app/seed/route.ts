import seed from '@/scripts/seed';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { NextURL } from 'next/dist/server/web/next-url';
import * as actions from '@/lib/database/actions';

export async function GET(req: Request)
{
    const nexturl = new NextURL(req.url);
    const email = nexturl.searchParams.get('email');
    return Response.json(await actions.getAccountByEmail(email!));
}

export async function POST(req: Request)
{
    const nexturl = new NextURL(req.url);
    const email = nexturl.searchParams.get('email')!;
    const password = nexturl.searchParams.get('password')!;
    const name = nexturl.searchParams.get('name')!;
    const phone = nexturl.searchParams.get('phone')!;
    const status = await actions.createAccount({ name: name, email: email, password: password, phone: phone, role: "customer", pickupPoint: undefined, transitHub: undefined });
    return Response.json(status);
}