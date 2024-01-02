'use client';

import { Button } from '@/app/ui/common/buttons';
import { createOrder } from '@/lib/frontend/actions/pickupstaff';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '../common/Input';
import { useForm } from '../common/hooks';
import { email, nonNegative, phone, required } from '@/lib/validation';

export default function CreateOrderForm() {
  const router = useRouter();
  const { errors, serverError, loading, submit } = useForm({
    sender: email,
    weight: nonNegative,
    receiverAddress: required,
    receiverNumber: phone,
    pickupTo: required,
    charge: nonNegative,
  }, async (form) => {
    const res = await createOrder(form);
    if (!res) throw new Error('Server Error');
    window.print();
    router.push('/home/pickupstaff/pending');
  });

  return (
    <>
      <form action={submit} className='mt-4 print:hidden'>
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <Input 
            label="Email"
            id="sender"
            name="sender"
            type="email"
            defaultValue=""
            placeholder="Email"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            error={errors.sender}
            required
          />
          <Input 
            label="Weight"
            id="weight"
            name="weight"
            type="number"
            defaultValue=""
            placeholder="Weight"
            step='0.01'
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            error={errors.weight}
            required
          />
          <Input 
            label="Receiver Address"
            id="receiverAddress"
            name="receiverAddress"
            type="text"
            defaultValue=""
            placeholder="Receiver Address"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            error={errors.receiverAddress}
            required
          />
          <Input 
            label="Receiver Phone"
            id="receiverNumber"
            name="receiverNumber"
            type="text"
            defaultValue=""
            placeholder="Receiver Phone"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            error={errors.receiverNumber}
            required
          />
          <Input 
            label="Destination Pickup Point"
            id="pickupTo"
            name="pickupTo"
            type="text"
            defaultValue=""
            placeholder="Destination Pickup Point"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            error={errors.pickupTo}
            required
          />
          <Input 
            label="Charge"
            id="charge"
            name="charge"
            type="number"
            defaultValue=""
            placeholder="Charge"
            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            error={errors.charge}
            required
          />
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button 
            onClick={router.back}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            Cancel
          </button>
          <Button type="submit" disabled={loading}>Create Order</Button>
        </div>
        <div aria-live="polite" aria-atomic="true">
          {serverError && 
            <p className="mt-2 text-sm text-red-500">
                            {typeof serverError === "object" ? (serverError as any).error : serverError}
            </p>
          }
        </div>
      </form>
      <InvoiceForPrint/>
    </>
  );
}


function InvoiceForPrint(props: {}) {
  return <Image src="/invoice.jpg" width={1000} height={1414} alt="invoice" className="fixed top-0 left-0 hidden print:block" />;
}
