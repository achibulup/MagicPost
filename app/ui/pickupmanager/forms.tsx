'use client';

import { Button } from '@/app/ui/common/buttons';
import { createEmployee, changeEmployee } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type Errors = {
  server?: string;
  email?: string;
  name?: string;
  phone?: string;
  role?: string;
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


export function EditEmployeeForm({ className, employeeId }: { 
  className?: string,
  employeeId: number 
}) {
  const [error, setError] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const formhandler = (form: FormData) => {
    setPending(true);
    changeEmployee(employeeId, form).then((res) => {
      if (res) {
        router.push('/home/pickupmanager/employees');
      } else {
        setError({ server: 'Server Error' });
        setPending(false);
      }
    }).catch((err) => {
      setError({ server: err.message ?? err.error });
      setPending(false);
    });
  }

  return (
    <form action={formhandler} className={'mt-4 ' + (className ?? '')}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Input 
          label="Name"
          id="name"
          name="name"
          type="Text"
          defaultValue=""
          placeholder="Name"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.name}
        />
        <Input 
          label="Email"
          id="Email"
          name="email"
          type="email"
          defaultValue=""
          placeholder="Email"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.email}
        />
        <Input 
          label="Phone"
          id="phone"
          name="phone"
          type="text"
          defaultValue=""
          placeholder="Phone"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.phone}
        />
        <div className="mt-6 flex justify-end gap-4">
          <button 
            disabled={pending}
            onClick={router.back}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <Button type="submit" disabled={[console.log(pending), pending][1] as boolean}>Save Changes</Button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {error.server && 
            <p className="mt-2 text-sm text-red-500">
                            {typeof error.server === "object" ? (error.server as any).error : JSON.stringify(error.server)}
            </p>
          }
        </div>
      </div>
    </form>
  );
}

export function CreateEmployeeForm() {
  const [error, setError] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const formhandler = (form: FormData) => {
    setPending(true);
    createEmployee(form).then((res) => {
      if (res) {
        router.push('/home/pickupmanager/employees');
      } else {
        setError({ server: 'Server Error' });
        setPending(false);
      }
    }).catch((err) => {
      setError({ server: err.message ?? err.error });
      setPending(false);
    });
  }

  return (
    <form action={formhandler} className='mt-4'>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Input 
          label="Name"
          id="name"
          name="name"
          type="Text"
          defaultValue=""
          placeholder="Name"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.name}
        />
        <Input 
          label="Email"
          id="Email"
          name="email"
          type="email"
          defaultValue=""
          placeholder="Email"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.email}
        />
        <Input 
          label="Phone"
          id="phone"
          name="phone"
          type="text"
          defaultValue=""
          placeholder="Phone"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.phone}
        />
        <Input 
          label="Role"
          id="role"
          name="role"
          type="text"
          defaultValue="staff"
          placeholder="Role"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.role}
        />
        <div className="mt-6 flex justify-end gap-4">
          <button  
            disabled={pending}
            onClick={router.back}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <Button type="submit" disabled={pending}>Create</Button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {error.server && 
            <p className="mt-2 text-sm text-red-500">
                            {typeof error.server === "object" ? (error.server as any).error : JSON.stringify(error.server)}
            </p>
          }
        </div>
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
