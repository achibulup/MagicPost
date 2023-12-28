import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import * as actions from '../database/actions';


export type Session = {
  id: number;
  email: string;
  role: "customer" | "shipper" | "staff" | "manager";
  pickupPoint: number | null;
  transitHub: number | null;
};

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


export async function getUserProfile() {
  const cookie = cookies().get('session-token');
  if (!cookie?.value) {
    return undefined;
  }
  return verifySession(cookie.value);
}

export async function setAuthCookie(session: Session) {
  // set httpOnly cookie
  cookies().set('session-token', await signSession(session), {
    httpOnly: true,
    path: '/'
  });
}

export async function clearAuthCookie() {
  cookies().delete('session-token');
}

export async function authenticate(email: string, password: string) {
  const account = await actions.getAccountByEmail(email);
  if (!account) {
    return null;
  }
  if (await actions.comparePassword(password, account.password)) {
    const session: Session & { status: string } = {
      id: account.id,
      email: account.email,
      role: account.role,
      pickupPoint: account.pickupPoint,
      transitHub: account.transitHub,
      status: account.status
    };
    return session;
  }
  return null;
}