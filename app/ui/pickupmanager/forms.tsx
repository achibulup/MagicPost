'use client';

import { Button } from '@/app/ui/common/buttons';
import { createEmployee, changeEmployee } from '@/lib/frontend/actions/pickupmanager';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../common/Input';
import { useForm } from '../common/hooks';
import { optional, email, phone, required } from '@/lib/validation';

export function EditEmployeeForm({ className, employeeId }: { 
  className?: string,
  employeeId: number 
}) {
  const router = useRouter();
  const { errors, serverError, loading, submit } = useForm({
    email: optional(email),
    name: [],
    phone: optional(phone)
  }, async (form) => {
    const res = await changeEmployee(employeeId, form);
    if (!res) throw new Error('Server Error');
    router.push('/home/pickupmanager/employees');
  });

  return (
    <form action={submit} className={'mt-4 ' + (className ?? '')}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Input 
          label="Name"
          id="name"
          name="name"
          type="text"
          defaultValue=""
          placeholder="Name"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={errors.name}
        />
        <Input 
          label="Email"
          id="Email"
          name="email"
          type="email"
          defaultValue=""
          placeholder="Email"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={errors.email}
        />
        <Input 
          label="Phone"
          id="phone"
          name="phone"
          type="text"
          defaultValue=""
          placeholder="Phone"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={errors.phone}
        />
        <div className="mt-6 flex justify-end gap-4">
          <button 
            disabled={loading}
            onClick={router.back}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <Button type="submit" disabled={[console.log(loading), loading][1] as boolean}>Save Changes</Button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {serverError && 
            <p className="mt-2 text-sm text-red-500">
                            {typeof serverError === "object" ? (serverError as any).error : serverError}
            </p>
          }
        </div>
      </div>
    </form>
  );
}

export function CreateEmployeeForm() {
  const router = useRouter();
  const { errors, serverError, loading, submit } = useForm({
    email: email,
    name: required,
    phone: phone,
    role: (v) => (v && ['staff', 'shipper'].includes(v) ? undefined : 'Invalid role')
  }, async (form) => {
    const res = await createEmployee(form);
    if (!res) throw new Error('Server Error');
    router.push('/home/pickupmanager/employees');
  });

  return (
    <form action={submit} className='mt-4'>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <Input 
          label="Name"
          id="name"
          name="name"
          type="Text"
          defaultValue=""
          placeholder="Name"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={errors.name}
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
          error={errors.email}
        />
        <Input 
          label="Phone"
          id="phone"
          name="phone"
          type="text"
          defaultValue=""
          placeholder="Phone"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={errors.phone}
        />
        <Input 
          label="Role"
          id="role"
          name="role"
          type="text"
          defaultValue="staff"
          placeholder="Role"
          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          error={errors.role}
        />
        <div className="mt-6 flex justify-end gap-4">
          <button  
            disabled={loading}
            onClick={router.back}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <Button type="submit" disabled={loading}>Create</Button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {serverError && 
            <p className="mt-2 text-sm text-red-500">
                            {typeof serverError === "object" ? (serverError as any).error : serverError}
            </p>
          }
        </div>
      </div>
    </form>
  );
}
