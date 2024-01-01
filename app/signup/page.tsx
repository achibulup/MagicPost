import React from 'react';
import SignupForm from '../ui/signup/signup-form';
import { getUserProfile } from '@/lib/backend/auth/session';
import { redirect } from 'next/navigation';
import LoginForm from "@/app/ui/login/login-form";

export default async function page() {
    const session = await getUserProfile();
    if (session) {
        redirect('/home');
    }
    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="relative mx-auto flex w-full max-w-[850px] flex-col space-y-2.5 p-8">
              <SignupForm/>
            </div>
        </main>
    )
}