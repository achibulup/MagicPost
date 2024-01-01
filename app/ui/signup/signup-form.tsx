'use client';

import { signup } from '@/lib/frontend/clientside';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/ui/common/buttons';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Input from '../common/Input';
import { useFormValidator } from '../common/hooks';
import { email, minLength, nonNegative, phone } from '@/lib/validation';

export default function SignupForm() {
  const [error, validate] = useFormValidator({
    email: email,
    name: [],
    phone: phone,
    password: minLength(6)
  });
  const [cfPwdError, setCfPwdError] = useState<string | undefined>(undefined);
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleSubmit = (form: FormData) => {
    const ok = validate(form);
    if (form.get('password') !== form.get('confirmPassword')) {
      setCfPwdError('Passwords do not match');
      return;
    } else {
      setCfPwdError(undefined);
    }
    if (!ok) return;
    setPending(true);
    form.delete('confirmPassword');
    signup(form).then((result) => {
      if (result.error) {
        setServerError(result.error);
      } else {
        router.push('/login');
      }
      setPending(false);
    });
  };

  return (
    <div className="flex rounded-2xl max-w-3xl p-5 items-center">
      <div className="md:w-1/2 px-8 md:px-16">
        <h2 className="font-bold text-2xl">Sign up</h2>

        <form action={handleSubmit} className="flex flex-col gap-0">
          <Input 
            className="p-1 rounded-xl text-sm mb-0" 
            id="email"
            label="Email"
            type="email" 
            name="email" 
            placeholder="Email" 
            required
            error={error.email}
          />
          <Input 
            className="p-1 rounded-xl text-sm mb-0" 
            id="name"
            label="Name"
            type="text" 
            name="name" 
            placeholder="Name" 
            required
            error={error.name}
          />
          <Input 
            className="p-1 rounded-xl text-sm mb-0" 
            id="phone"
            label="Phone"
            type="tel" 
            name="phone"
            placeholder="Phone Number"
            required
            error={error.phone}
          />
          <Input 
            className="p-1 rounded-xl text-sm mb-0" 
            id="password"
            label="Password"
            type="password" 
            name="password"
            placeholder="Password" 
            required
            minLength={6}
            error={error.password}
          />
          <Input 
            className="p-1 rounded-xl text-sm mb-0" 
            id="confirmPassword"
            label="Confirm Password"
            type="password" 
            name="confirmPassword"
            placeholder="Confirm Password" 
            required
            minLength={6}
            error={cfPwdError}
          />
          <SignupButton pending={pending}/>
          {serverError && <p className="text-red-500">{serverError}</p>}
        </form>

        <div className="mt-4 text-xs flex justify-between items-center text-black">
          <p>You already have an account?</p>
          <button onClick={handleLoginRedirect} className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Login
          </button>
        </div>
      </div>
      <div className="md:block hidden w-3/4">
        <Image className="rounded-2xl" src="/pic.jpeg" width={500} height={500} alt="illustration"/>
      </div>
    </div>
  );
}

function SignupButton({pending}: { pending: boolean }) {
  return (
    <Button className="mt-4 w-full" aria-disabled={pending} disabled={pending || false}>
      Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50"/>
    </Button>
  );
}