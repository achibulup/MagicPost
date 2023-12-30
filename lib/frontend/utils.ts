import { unstable_noStore as noStore } from "next/cache";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

export async function fetchWithCookies(url: string | URL | Request, forwardSetCookie?: boolean) {
  // console.log(url);
  forwardSetCookie ??= true;
  noStore();
  const token = cookies().get('session-token')?.value;
  // console.log(token);
  new Headers();
  const hd = new Headers();
  hd.append('cookie', cookies().toString() ?? '');
  const response = await fetch(url, {
    headers: hd,
    cache: 'no-cache',
  });
  if (forwardSetCookie) {
    const setCookie = response.headers.get('set-cookie');
    if (setCookie) {
      cookies().set('session-token', setCookie);
    }
  }
  return response;
}