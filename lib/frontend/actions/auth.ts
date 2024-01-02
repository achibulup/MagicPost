'use client'

export async function login(form: FormData) {
  const result = await fetch('/api/auth/login', {
    method: 'POST',
    body: form
  });
  // console.log("?");
  if (Math.floor(result.status / 100) !== 2) throw new Error((await result.json()).error);
  return result.json();
}

export async function signup(form: FormData) {
  const result = await fetch('/api/auth/signup', {
    method: 'POST',
    body: form
  });
  // console.log("?");
  return result.json();
}

export async function logout() {
  return await fetch('/api/auth/logout', {
    method: 'POST',
  });
}