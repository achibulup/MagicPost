'use client';

import { ReactNode, useEffect, useReducer, useState } from 'react';
import { fetchEmployees, fetchOrders } from '@/lib/frontend/actions/pickupmanager';
import type { OrderInfo } from '@/lib/frontend/actions/pickupmanager';
import { BasicTable, BasicDesktopTable } from '../common/table';
import Skeleton from './skeletons';
import { BasicButton } from '../common/buttons';
import { EditIcon, DeleteIcon } from '../common/icons';
import { useRerender } from '../common/hooks';
import { useRouter } from 'next/navigation';
import type { AccountExtended } from '@/lib/backend/database/actions';

export const revalidate = 1;

export function EmployeeTable() {
  const columnTitles = ['Employee', 'Email', 'Phone', 'Role', 'Action'];
  const skeleton = <Skeleton columns={columnTitles} nbuttons={1} />;
  const [employees, setEmployees] = useState<AccountExtended[] | null>(null);
  const [dep, revalidate] = useReducer((x) => x + 1, 0);
  const router = useRouter();
  const rerender = useRerender();
  useEffect(() => {
    (async()=>{
      setEmployees(null);
      const employees = await fetchEmployees();
      setEmployees(employees);
    })();
  }, [dep]);
  // console.log(employees);

  const redirectToEditForm = (employeeId: number) => {
    router.push(`/home/pickupmanager/employees/${employeeId}/edit`);
  }

  return (employees == null ? skeleton :
    <BasicTable>
      <table className="md:hidden w-full">
        {employees?.map((employee) => (
          <tr
            key={employee.id}
            className="flex justify-between mb-2 w-full rounded-md bg-white p-4"
          >
            <td className="items-center justify-between bemployee-b pb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>
                <div className="mb-2 flex items-center">
                  <div className="flex items-center gap-3">
                    <p>{employee.name}</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs">Role</p>
                <p className="font-medium">{employee.role}</p>
              </div>
            </td>
            <td className="items-center justify-between bemployee-b py-5">
              <div>
                <p className="text-xs">Email</p>
                <p className="font-medium">{employee.email}</p>
              </div>
              <div>
                <p className="text-xs">Phone</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </td>
            <td className="items-center justify-between bemployee-b py-5"> 
              <div>
                <BasicButton onClick={() => redirectToEditForm(employee.id)}>
                  <EditIcon/>
                </BasicButton> 
              </div>
            </td>
          </tr>
        ))}
      </table>
      <BasicDesktopTable columnTitles={columnTitles} 
        rows={employees.map((employee, index) => ({
          id: employee.id,
          entries: [
            employee.name,
            employee.email,
            employee.phone,
            employee.role,
            <BasicButton onClick={() => redirectToEditForm(employee.id)}>
              <EditIcon/>
            </BasicButton> 
          ] as ReactNode[]
        }))}
      ></BasicDesktopTable>
    </BasicTable>
  );
}

export function OrderTable() {
  const columnTitles = ['Sender', 'From', 'To', 'Send date', 'Status', 'Invoice'];
  const skeleton = <Skeleton columns={columnTitles} />;
  const [orders, setOrders] = useState<OrderInfo[] | null>(null);
  useEffect(() => {
    (async()=>{
      setOrders(null);
      const orders = await fetchOrders();
      setOrders(orders);
    })();
  }, []);
  // console.log(orders);
  return (orders == null ? skeleton :
    <BasicTable>
      <div className="md:hidden">
        {orders?.map((order) => (
          <div
            key={order.id}
            className="mb-2 w-full rounded-md bg-white p-4"
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Customer
                </p>
                <div className="mb-2 flex items-center">
                  <div className="flex items-center gap-3">
                    <p>{order.sender}</p>
                  </div>
                </div>
              </div>
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">Invoice</p>
                <p className="font-medium">{order.charge}</p>
              </div>
            </div>
            <div className="flex w-full items-center justify-between border-b py-5">
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">From</p>
                <p className="font-medium">{order.from}</p>
              </div>
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">To</p>
                <p className="font-medium">{order.to}</p>
              </div>
            </div>
            <div className="flex w-full items-center justify-between border-b py-5">
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">Sent Date</p>
                <p className="font-medium">{order.sendDate}</p>
              </div>
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">Status</p>
                <p className="font-medium">{order.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BasicDesktopTable columnTitles={columnTitles} 
        rows={orders.map((order) => ({
          id: order.id,
          entries: [
            order.sender,
            order.from,
            order.to,
            order.sendDate,
            order.status,
            order.charge
          ]
        }))}
      ></BasicDesktopTable>
    </BasicTable>
  );
}