import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import * as actions from '../database/actions';
import { unstable_noStore as noStore } from 'next/cache';
import { parse } from 'cookie';

export type Session = {
  id: number;
  email: string;
} & ({
  role: "manager" | "staff" | "shipper";
  pickupPoint: number;
  transitHub? : null;
} | {
  role: "manager" | "staff";
  pickupPoint?: null;
  transitHub: number;
} |{
  role: "customer" | "director";
  pickupPoint?: null;
  transitHub?: null;
});


export async function verifySession(token: string) {
  return new Promise<Session | null>((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      if (err) {
        resolve(null);
      }
      resolve(decoded as Session);
    });
  });
}
export async function signSession(session: Session) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(session, process.env.JWT_SECRET!, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token!);
    });
  });
}


export async function getUserProfile(req: Request) {
  noStore();
  const rawCookie = req.headers.get('cookie');
  console.log(rawCookie);
  const cookies = rawCookie !== null ? parse(rawCookie) : {};
  const cookie = cookies['session-token'];
  if (!cookie) {
    return undefined;
  }
  return verifySession(cookie);
}

export async function setAuthCookie(session: Session) {
  // set httpOnly cookie
  cookies().set('session-token', await signSession(session), {
    httpOnly: true,
    path: '/'
  });
}

export async function clearAuthCookie() {
  noStore();
  cookies().delete('session-token');
}

export async function authenticate(email: string, password: string) {
  const account = await actions.getAccountByEmail(email);
  if (!account) {
    return null;
  }
  if (await actions.comparePassword(password, account.password)) {
    const session = {
      id: account.id,
      email: account.email,
      role: account.role,
      pickupPoint: account.pickupPoint,
      transitHub: account.transitHub,
      status: account.status
    } as Session & { status: string };
    return session;
  }
  return null;
}