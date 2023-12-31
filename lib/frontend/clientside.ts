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