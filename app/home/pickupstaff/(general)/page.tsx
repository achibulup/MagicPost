import React, { Suspense } from 'react'
import Table from '@/app/ui/pickupstaff/table'
import Skeleton from '@/app/ui/pickupstaff/skeletons'
import { lusitana } from '@/app/ui/common/fonts';
import Search from '@/app/ui/common/search';

export default function Page() {
  console.log('ShipperPage')
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Orders
      </h1>
      <Search placeholder="Search orders..." />
      <Table/>
    </div>
  )
}
