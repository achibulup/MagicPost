import { NextResponse } from 'next/server';
import { getUserProfile } from '@/lib/auth/session';

export async function GET(req: Request) {  
  
  const profile = await getUserProfile(req);
  // console.log(profile);
  if (!profile) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    )
  }
  return NextResponse.json({
    id: profile.id,
    email: profile.email,
    role: profile.role,
    pickupPoint: profile.pickupPoint,
    transitHub: profile.transitHub,
    phone: profile?.transitHub
  })
}