'use client';

import {signup} from '@/lib/frontend/clientside';
import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/app/ui/common/buttons';
import {ArrowRightIcon} from '@heroicons/react/20/solid';

export default function SignupForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [pending, setPending] = useState(false);
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        setPending(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        signup(formData).then((result) => {
            if (result.error) {
                setErrorMessage(result.error);
            } else {
                router.refresh();
            }
            setPending(false);
        });
    };

    return (
        <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
            <div className="md:w-1/2 px-8 md:px-16">
                <h2 className="font-bold text-2xl text-[#002D74]">Sign up</h2>
                <p className="text-xs mt-4 text-[#002D74]">Please fill in the form to create an account</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input className="p-2 mt-6 rounded-xl border text-sm" type="email" name="email" placeholder="Email"
                           value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    <input className="p-2 rounded-xl border text-sm" type="text" name="name" placeholder="Name"
                           value={name} onChange={(e) => setName(e.target.value)} required/>
                    <input className="p-2 rounded-xl border text-sm" type="tel" name="phone"
                           placeholder="Phone Number"
                           value={phone} onChange={(e) => setPhone(e.target.value)} required/>
                    <input className="p-2 rounded-xl border text-sm" type="password" name="password"
                           placeholder="Password"
                           value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    <input className="p-2 rounded-xl border text-sm" type="password" name="confirmPassword"
                           placeholder="Confirm Password"
                           value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    <SignupButton pending={pending}/>
                </form>

                <div className="mt-4 text-xs flex justify-between items-center text-[#002D74]">
                    <p>You already have an account?</p>
                    <button onClick={handleLoginRedirect} className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Login
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

function SignupButton({pending}: { pending: boolean }) {
    return (
        <Button className="mt-4 w-full" aria-disabled={pending} disabled={pending || false}>
            Sign up <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50"/>
        </Button>
    );
}