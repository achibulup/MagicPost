'use client';

import { Button } from '@/app/ui/common/buttons';
import { createEmployee, changeEmployee } from '@/lib/frontend/actions/admin';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../common/Input';
import { useFormValidator } from '../common/hooks';
import { optional, email, minLength, phone, required } from '@/lib/validation';

type Errors = {
  server?: string;
  email?: string;
  name?: string;
  phone?: string;
  facility?: string;
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
  required?: any;
}


export function EditEmployeeForm({ className, employeeId }: { 
  className?: string,
  employeeId: number 
}) {
  const [error, validate] = useFormValidator({
    email: optional(email),
    name: [],
    phone: optional(phone),
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const formhandler = (form: FormData) => {
    if (!validate(form)) return;
    setPending(true);
    changeEmployee(employeeId, form).then((res) => {
      if (res) {
        router.push('/home/admin/employees');
      } else {
        setServerError('Server Error');
        setPending(false);
      }
    }).catch((err) => {
      setServerError(err.message ?? err.error)
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
          <Button type="submit" disabled={pending}>Save Changes</Button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {serverError && 
            <p className="mt-2 text-sm text-red-500">
                            {typeof serverError === "object" ? (serverError as any).error : JSON.stringify(serverError)}
            </p>
          }
        </div>
      </div>
    </form>
  );
}

export function CreateEmployeeForm() {
  const [error, validate] = useFormValidator({
    email: email,
    name: required,
    phone: phone,
    facility: required
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const formhandler = (form: FormData) => {
    setPending(true);
    createEmployee(form).then((res) => {
      if (res) {
        router.push('/home/admin/employees');
      } else {
        setServerError('Server Error');
        setPending(false);
      }
    }).catch((err) => {
      setServerError(err.message ?? err.error)
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
          required
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
          required
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
          required
        />
        <Input 
          label="Facility"
          id="facility"
          name="facility"
          type="text"
          defaultValue=""
          placeholder="Facility"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={error.facility}
          required
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
          {serverError && 
            <p className="mt-2 text-sm text-red-500">
                            {typeof serverError === "object" ? (serverError as any).error : JSON.stringify(serverError)}
            </p>
          }
        </div>
      </div>
    </form>
  );
}

