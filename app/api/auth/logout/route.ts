import { NextApiRequest, NextApiResponse } from 'next';
import type { Session } from '@/lib/backend/auth/session';
import { authenticate, clearAuthCookie, getUserProfile } from '@/lib/backend/auth/session';
import { NextResponse } from 'next/server';

type ResponseData = {
    success?: boolean;
    error?: string;
}

export async function POST(req: Request) {
    const user = await getUserProfile(req);
    if (!user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 });
    }
    clearAuthCookie();
    return NextResponse.json({ success: true });
}