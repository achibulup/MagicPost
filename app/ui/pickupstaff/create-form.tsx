'use client';

import { Button } from '@/app/ui/common/buttons';
import { createOrder } from '@/app/ui/pickupstaff/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Errors = {
  server?: string;
  sender?: string;
  weight?: string;
  receiverAddress?: string;
  receiverNumber?: string;
  pickupTo?: string;
  charge?: string;
}

interface InputProps {
  label: string;
  id: string;
  name: string;
  type: string;
  defaultValue: string;
  step?: string;
  placeholder: string;
  className: string;
  error?: string;
}


export default function CreateOrderForm() {
  const [error, setError] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const formhandler = (form: FormData) => {
    setPending(true);
    createOrder(form).then((res) => {
      if (res) {
        router.push('/home/pickupstaff/');
      } else {
        setError({ server: 'Server Error' });
        setPending(false);
      }
    }).catch((err) => {
      setError({ server: err });
      setPending(false);
    });
  }

  return (
    <form action={formhandler} className='mt-4'>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Input 
          label="Email"
          id="sender"
          name="sender"
          type="email"
          defaultValue=""
          placeholder="Email"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.sender}
        />
        <Input 
          label="Weight"
          id="weight"
          name="weight"
          type="number"
          defaultValue=""
          placeholder="Weight"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.weight}
        />
        <Input 
          label="Receiver Address"
          id="receiverAddress"
          name="receiverAddress"
          type="text"
          defaultValue=""
          placeholder="Receiver Address"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.receiverAddress}
        />
        <Input 
          label="Receiver Phone"
          id="receiverNumber"
          name="receiverNumber"
          type="text"
          defaultValue=""
          placeholder="Receiver Phone"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.receiverNumber}
        />
        <Input 
          label="Destination Pickup Point"
          id="pickupTo"
          name="pickupTo"
          type="text"
          defaultValue=""
          placeholder="Destination Pickup Point"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.pickupTo}
        />
        <Input 
          label="Charge"
          id="charge"
          name="charge"
          type="number"
          defaultValue=""
          placeholder="Charge"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.charge}
        />
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <button 
          onClick={router.back}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </button>
        <Button type="submit" disabled={pending}>Edit Invoice</Button>
      </div>
    </form>
  );
}


const Input: React.FC<InputProps> = ({
  label,
  id,
  name,
  type,
  defaultValue,
  step,
  placeholder,
  className,
  error,
}) => {
  return (
    <div className='mb-4'>
      <label htmlFor={id} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-2 rounded-md">
        <div className="relative">
          <input
            id={id}
            name={name}
            type={type}
            defaultValue={defaultValue}
            step={step}
            placeholder={placeholder}
            className={'p-3 ' + className}
          />
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true">
        {error && 
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        }
      </div>
    </div>
  );
};
