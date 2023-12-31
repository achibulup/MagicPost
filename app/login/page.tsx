import React from 'react'
import Link from 'next/link'
import { lusitana } from '@/app/ui/common/fonts'
import LoginForm from '../ui/login/login-form'
import { getUserProfile } from '@/lib/backend/auth/session'
import { redirect } from 'next/navigation'

export default async function page() {
  const session = await getUserProfile();
  if (session) {
    redirect('/home');
  }
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-5 md:h-36">
          <div className={`w-32 text-white text-[44px] md:w-36 ${lusitana.className}`}>
            MagicPost
          </div>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
