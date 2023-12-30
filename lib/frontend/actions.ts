'use client'

export async function login(form: FormData) {
  const result = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    body: form
  });
  // console.log("?");
  return result.json();
}

export async function logout() {
  return await fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
  });
}