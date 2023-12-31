import React from 'react'
import Link from 'next/link'
import { getUserProfile } from '@/lib/backend/auth/session'
import { redirect } from 'next/navigation'

export default async function page() {
  // TODO: stub
  const session = await getUserProfile();
  if (session) {
    redirect('/home');
  }
  return (
    <div>signup
      <form>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <Link href="/login">Signup</Link>
      </form>
    </div>
  )
}
