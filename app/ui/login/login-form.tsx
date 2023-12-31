'use client';

import {login} from '@/lib/frontend/clientside';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import { Button } from '@/app/ui/common/buttons';
import { ArrowRightIcon } from '@heroicons/react/20/solid';

export default function LoginForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const handleSignupRedirect = () => {
        router.push('/signup');
    };

    return (
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
            <div className="md:w-1/2 px-8 md:px-16">
                <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
                <p className="text-xs mt-4 text-[#002D74]">If you are already a member, easily log in</p>

                <form action={(form) => {
                    setPending(true);
                    login(form).then((result) => {
                        if (result.error) {
                            setErrorMessage(result.error);
                        } else {
                            router.refresh();
                        }
                        setPending(false);
                    });
                }} className="flex flex-col gap-4">
                    <input className="p-2 mt-8 rounded-xl border text-sm" type="email" name="email" placeholder="Enter your email address"
                           required/>
                    <div className="relative">
                        <input className="p-2 rounded-xl border w-full text-sm" type="password" name="password"
                               placeholder="Enter password" minLength={6} required/>
                    </div>
                    <LoginButton pending={[console.log('passing', pending) as any, pending][1]}/>
                </form>


                <div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
                    <a href="#">Forgot your password?</a>
                </div>

                <div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
                    <p>Don't have an account?</p>
                    <button onClick={handleSignupRedirect} className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Register
                    </button>
                </div>
            </div>
          <div className="md:block hidden w-1/2">
            <img className="rounded-2xl"
                 src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80"/>
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