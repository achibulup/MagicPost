'use client';

import { useEffect, useReducer, useState } from 'react';
import { OrderInfo, fetchOrders } from '@/lib/frontend/actions/customer';
import { BasicTable, BasicDesktopTable } from '../common/table';
import Skeleton from './skeletons';
import type { Tab } from '@/lib/frontend/actions/customer';

export const revalidate = 1;

export default function Table({ tab }: { tab?: Tab }) {
  const columnTitles = ['Address', 'Send date', 'Status', 'Invoice'];
  const skeleton = <Skeleton columns={columnTitles} />;
  const [orders, setOrders] = useState<OrderInfo[] | null>(null);
  useEffect(() => {
    (async()=>{
      setOrders(null);
      const orders = await fetchOrders(tab);
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
                {/* <p className="text-sm text-gray-500">
                  Address
                </p> */}
                <div className="mb-2 flex items-center">
                  <div className="flex items-center gap-3">
                    <p>{order.receiverAddress}</p>
                  </div>
                </div>
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
              <div className="flex w-1/2 flex-col">
                <p className="text-xs">Invoice</p>
                <p className="font-medium">{order.charge}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BasicDesktopTable columnTitles={columnTitles} 
        rows={orders.map((order) => ({
          id: order.id,
          entries: [
            order.receiverAddress,
            order.sendDate,
            order.status,
            order.charge
          ]
        }))}
      ></BasicDesktopTable>
    </BasicTable>
  );
}