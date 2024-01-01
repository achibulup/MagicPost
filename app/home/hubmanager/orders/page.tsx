import React, { Suspense } from 'react'
import { OrderTable } from '@/app/ui/hubmanager/tables'
import { lusitana } from '@/app/ui/common/fonts';
import Search from '@/app/ui/common/search';

export default async function CustomerPage() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        All Orders
      </h1>
      <Search placeholder="Search ..." />
      <OrderTable/>
    </div>
  )
}
