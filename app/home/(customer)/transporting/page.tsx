import React, { Suspense } from 'react'
import CustomersTable from '@/app/ui/customer/table'
import { TableSkeleton } from '@/app/ui/customer/skeletons'
import { lusitana } from '@/app/ui/fonts';
import Search from '@/app/ui/search';

export default async function CustomerPage() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Transporting orders
      </h1>
      <Search placeholder="Search orders..." />
      <Suspense fallback={<TableSkeleton columns={["Address", "Send date", "Status", "Charge"]}/>}>
        <CustomersTable tab="transporting"/>
      </Suspense>
    </div>
  )
}
