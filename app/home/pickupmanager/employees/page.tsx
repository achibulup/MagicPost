import React, { Suspense } from 'react'
import { EmployeeTable } from '@/app/ui/pickupmanager/tables'
import { lusitana } from '@/app/ui/common/fonts';
import { AddButton } from '@/app/ui/common/buttons';
import { PlusIcon } from '@/app/ui/common/icons';
import Search from '@/app/ui/common/search';

export default async function CustomerPage() {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Employees
      </h1>
      <div className="flex gap-2">
        <Search placeholder="Search ..." />
        <AddButton href="/home/pickupmanager/employees/create">
          <PlusIcon/>
          <p className="hidden md:inline ml-2">Create Employee</p>
        </AddButton>
      </div>
      <EmployeeTable/>
    </div>
  )
}
