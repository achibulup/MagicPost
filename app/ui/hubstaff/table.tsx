'use client';

import { ReactNode, useEffect, useReducer, useState } from 'react';
import { OrderInfo, fetchOrders, checkinOrder, checkoutOrder} from './actions';
import { BasicTable, BasicDesktopTable } from '../common/table';
import Skeleton from './skeletons';
import type { Tab } from './actions';
import { BasicButton } from '../common/buttons';
import { EditIcon, DeleteIcon, DeliveringIcon, DeliveredIcon, OrdersIcon } from '../common/icons';
import { useRerender } from '../common/hooks';

export const revalidate = 1;

export default function Table({ tab }: { tab?: Tab }) {
  // console.log('ShippersTable');
  const columnTitles = ['Id', 'Pickup from', 'Pickup to', 'Send date', 'Status', 'Action'];
  // if (!tab || ['ready', 'delivering'].includes(tab)) columnTitles.push('Action');
  const skeleton = <Skeleton columns={columnTitles} nbuttons={1} />;
  const [orders, setOrders] = useState<OrderInfo[] | null>(null);
  const [dep, revalidate] = useReducer((x) => x + 1, 0);
  const rerender = useRerender();
  useEffect(() => {
    (async()=>{
      setOrders(null);
      const orders = await fetchOrders(tab);
      setOrders(orders);
    })();
  }, [dep]);
  // console.log(orders);

  const handleCheckin = (order: OrderInfo) => {
    checkinOrder(order.id).then((result) => {
      if (result) {
        if (tab === 'incoming') {
          orders?.splice(orders.indexOf(order), 1);
          rerender();
        } else revalidate();
      }
    });
  }
  const handleCheckout = (order: OrderInfo) => {
    checkoutOrder(order.id).then((result) => {
      if (result) {
        orders?.splice(orders.indexOf(order), 1);
        rerender();
      }
    });
  }

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
                  Id
                </p>
                <div className="mb-2 flex items-center">
                  <div className="flex items-center gap-3">
                    <p>{order.id}</p>
                  </div>
                </div>
              </div>
              <div>
                {[3, 5].includes(order.statusNumber) ? (
                  <BasicButton onClick={handleCheckin.bind(null, order)}>
                    <DeliveredIcon/>
                  </BasicButton> 
                ) : [4, 6].includes(order.statusNumber) ? (
                  <BasicButton onClick={handleCheckout.bind(null, order)}>
                    <OrdersIcon/>
                  </BasicButton> 
                ) : undefined}
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
        rows={orders.map((order, index) => {
          const row = {
            id: order.id,
            entries: [
              order.id,
              order.from,
              order.to,
              order.sendDate,
              order.status,
              [3, 5].includes(order.statusNumber) ? (
                <BasicButton onClick={handleCheckin.bind(null, order)}>
                  <DeliveredIcon/>
                </BasicButton> 
              ) : [4, 6].includes(order.statusNumber) ? (
                <BasicButton onClick={handleCheckout.bind(null, order)}>
                  <OrdersIcon/>
                </BasicButton> 
              ) : undefined
            ] as ReactNode[]
          };
          return row;
        })}
      ></BasicDesktopTable>
    </BasicTable>
  );
}
