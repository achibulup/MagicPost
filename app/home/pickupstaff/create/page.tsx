import React, { Suspense } from 'react'
import Form from '@/app/ui/pickupstaff/create-form';
import { lusitana } from '@/app/ui/common/fonts';
import Search from '@/app/ui/common/search';

export default function Page() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Orders
      </h1>
      <Search placeholder="Search orders..." />
      <Form></Form>
    </div>
  )
}
