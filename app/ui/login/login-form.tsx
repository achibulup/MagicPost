'use client';

import { login } from '@/lib/frontend/clientside';
import { lusitana } from '@/app/ui/common/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/common/buttons';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// import { useFormState, useFormStatus } from 'react-dom';

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();
  // useEffect(() => {
  //   const handle = setInterval(() => {
  //     setPending((pending) => !pending);
  //   }, 1000);
  //   return () => {
  //     clearInterval(handle);
  //   };
  // }, []);

  // console.log('rendering', pending);
  return (
    <form action={(form) => {
      // console.log('push');
      setPending(true);
      login(form).then((result) => {
        if (result.error) {
          setErrorMessage(result.error);
        } else {
          router.refresh();
        }
        // console.log('pop');
        setPending(false);
      });
    }} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={3}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton pending={[console.log('passing', pending) as any, pending][1]}/>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link className="text-blue-500" href="/signup">Sign up</Link>
        </div>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

function LoginButton({ pending }: { pending: boolean}) {
  // console.log('receiving', pending);
  return (
    <Button className="mt-4 w-full" aria-disabled={pending} disabled={pending || false}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}