'use client';

import { ReactNode, useEffect, useReducer, useState } from 'react';
import { OrderInfo, acceptOrder, cancelOrder, confirmOrder, fetchOrders } from './actions';
import { BasicTable, BasicDesktopTable } from '../common/table';
import Skeleton from './skeletons';
import type { Tab } from './actions';
import { BasicButton } from '../common/buttons';
import { EditIcon, DeleteIcon, DeliveringIcon, DeliveredIcon } from '../common/icons';
import { useRerender } from '../common/hooks';

export const revalidate = 1;

export default function ShippersTable({ tab }: { tab?: Tab }) {
  console.log('ShippersTable');
  const columnTitles = ['Address', 'Send date', 'Status'];
  if (!tab || ['ready', 'delivering'].includes(tab)) columnTitles.push('Action');
  const skeleton = <Skeleton 
    columns={columnTitles} 
    nbuttons={!tab || tab === 'delivering' ? 2 : tab === 'ready' ? 1 : 0}
  />;
  const [orders, setOrders] = useState<OrderInfo[] | null>(null);
  const rerender = useRerender();
  useEffect(() => {
    (async()=>{
      setOrders(null);
      const orders = await fetchOrders(tab);
      setOrders(orders);
    })();
  }, []);
  // console.log(orders);

  const handleAccept = (order: OrderInfo) => {
    acceptOrder(order.id).then((result) => {
      if (result) {
        order.status = 'Delivering';
        const newOrders = filterOrders(orders!, tab);
        console.log(newOrders);
        setOrders(newOrders);
      }
    });
  }
  const handleDeliver = (order: OrderInfo) => {
    confirmOrder(order.id).then((result) => {
      if (result) {
        order.status = 'Delivered';
        const newOrders = filterOrders(orders!, tab);
        console.log(newOrders);
        setOrders(newOrders);
      }
    });
  }
  const handleCancel = (order: OrderInfo) => {
    cancelOrder(order.id).then((result) => {
      if (result) {
        order.status = 'Cancelled';
        const newOrders = filterOrders(orders!, tab);
        console.log(newOrders);
        setOrders(newOrders);
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
                {/* <p className="text-sm text-gray-500">
                  Address
                </p> */}
                <div className="mb-2 flex items-center">
                  <div className="flex items-center gap-3">
                    <p>{order.receiverAddress}</p>
                  </div>
                </div>
              </div>
              <div>
                {order.status === 'Ready' ? (
                  <BasicButton onClick={handleAccept.bind(null, order)}>
                    <DeliveringIcon/>
                  </BasicButton> 
                ) : order.status === 'Delivering' ? (
                  <>
                    <BasicButton key={1} onClick={handleDeliver.bind(null, order)}>
                      <DeliveredIcon/>
                    </BasicButton> 
                    <BasicButton key={2} onClick={handleCancel.bind(null, order)}>
                      <DeleteIcon/>
                    </BasicButton> 
                  </>
                ) : undefined}
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
              order.receiverAddress,
              order.sendDate,
              order.status,
            ] as ReactNode[]
          };
          if (!tab || ['ready', 'delivering'].includes(tab)) {
            const actions = [];
            if (order.status === 'Ready') {
              actions.push(
                <BasicButton onClick={handleAccept.bind(null, order)}>
                  <DeliveringIcon/>
                </BasicButton> 
              );
            } else if (order.status === 'Delivering') {
              actions.push(
                <BasicButton key={1} onClick={handleDeliver.bind(null, order)}>
                  <DeliveredIcon/>
                </BasicButton> 
              );
              actions.push(
                <BasicButton key={2} onClick={handleCancel.bind(null, order)}>
                  <DeleteIcon/>
                </BasicButton> 
              );
            }
            row.entries.push(<>{actions}</>)
          }
          return row;
        })}
      ></BasicDesktopTable>
    </BasicTable>
  );
}

function filterOrders(orders: OrderInfo[], tab?: Tab) {
  if (!tab) return [...orders];
  return orders.filter((order) => order.status.toLowerCase() === tab);
}