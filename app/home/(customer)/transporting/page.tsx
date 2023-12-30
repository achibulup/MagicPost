import React, { Suspense } from 'react'
import CustomersTable from '@/app/ui/customer/table'
import Skeleton from '@/app/ui/customer/skeletons'
import { lusitana } from '@/app/ui/common/fonts';
import Search from '@/app/ui/common/search';

export default async function CustomerPage() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Transporting orders
      </h1>
      <Search placeholder="Search orders..." />
      <Suspense fallback={<Skeleton columns={["Address", "Send date", "Status", "Charge"]}/>}>
        <CustomersTable tab="transporting"/>
      </Suspense>
    </div>
  )
}
