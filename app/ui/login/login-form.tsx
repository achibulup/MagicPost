'use client';

import {login} from '@/lib/frontend/clientside';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import { Button } from '@/app/ui/common/buttons';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Input from '../common/Input';
import { useFormValidator } from '../common/hooks';
import { email, minLength, required } from '@/lib/validation';

export default function LoginForm() {
  const [error, validate] = useFormValidator({
    email: email,
    password: minLength(6),
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleSignupRedirect = () => {
    router.push('/signup');
  };

  return (
    <div className="bg-gray-100 flex rounded-2xl max-w-3xl p-5 items-center">
      <div className="md:w-1/2 px-8 md:px-16">
        <h2 className="font-bold text-2xl ">Login</h2>

        <form action={(form) => {
          setServerError(undefined);
          if (!validate(form)) return;
          setPending(true);
          login(form).then((result) => {
            if (result.error) {
              setServerError(result.error);
            } else {
              router.refresh();
            }
            setPending(false);
          });
        }} className="flex flex-col gap-0">
          <Input 
            className="p-2 mb-0 rounded-xl border text-sm border-none" 
            id="email"
            label="Email"
            type="email" 
            name="email" 
            placeholder="Enter your email address"
            required
            error={error.email}
          />
          <Input 
            className="p-2 rounded-xl border w-full text-sm border-none" 
            id="password"
            label="Password"
            type="password" 
            name="password"
            placeholder="Enter password" 
            minLength={6} 
            required
            error={error.password}
          />
          <LoginButton pending={[console.log('passing', pending) as any, pending][1]}/>
        </form>

        <div className="mt-3 text-xs flex justify-between items-center ">
          <p>Don't have an account?</p>
          <button onClick={handleSignupRedirect} className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Register
          </button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {serverError && 
          <p className="mt-2 text-sm text-red-500">
            {typeof serverError === "object" ? (serverError as any).error 
            : JSON.stringify(serverError)}
          </p>
          }
        </div>
        
      </div>
      <div className="md:block hidden w-3/4">
        <Image className="rounded-2xl" src="/pic.jpeg" width={500} height={500} alt="illustration"/>
      </div>
    </div>
  );
}

function LoginButton({ pending }: { pending: boolean}) {
  console.log('receiving', pending);
  return (
    <Button className="mt-4 w-full" aria-disabled={pending} disabled={pending || false}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}