'use client'

import { useReducer } from 'react';

export async function login(form: FormData) {
  const result = await fetch('/api/auth/login', {
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

export function useRerender() {
  const [_, force] = useReducer((x) => x + 1, 0);
  return force;
}