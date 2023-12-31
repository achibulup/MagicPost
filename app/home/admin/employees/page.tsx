import React, { Suspense } from 'react'
import { EmployeeTable } from '@/app/ui/admin/tables'
import Skeleton from '@/app/ui/admin/skeletons'
import { lusitana } from '@/app/ui/common/fonts';
import Search from '@/app/ui/common/search';

export default async function CustomerPage() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Employees
      </h1>
      <Search placeholder="Search ..." />
      <EmployeeTable/>
    </div>
  )
}
