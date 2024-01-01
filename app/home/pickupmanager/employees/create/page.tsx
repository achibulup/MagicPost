import React, { Suspense } from 'react'
import { CreateEmployeeForm } from '@/app/ui/pickupmanager/forms'
import { lusitana } from '@/app/ui/common/fonts';
import { AddButton } from '@/app/ui/common/buttons';
import { PlusIcon } from '@/app/ui/common/icons';
import Search from '@/app/ui/common/search';

export default async function CustomerPage({ params: { employeeId }} : {
  params: { employeeId: string }
}) {
  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Create Employee
      </h1>
      <CreateEmployeeForm />
    </div>
  )
}
