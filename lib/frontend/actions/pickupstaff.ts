import { unstable_noStore as noStore } from 'next/cache'
// import { fetchWithCookies } from '@/lib/frontend/serverside';
import type { OrderExtended2 } from '@/lib/backend/database/actions';

type OrderInfo = {
  id: number;
  sender: string;
  receiverAddress: string;
  charge: number;
  status: string;
  sendDate: string;
  from: string;
  to: string;
  statusNumber: number;
}

export type { OrderInfo };

export type Tab = "pending" | "transported" | "incoming";

function formatData(data: OrderExtended2): OrderInfo {
  const sendDate = new Date(data.sendDate);
  const formattedSendDate = sendDate.toLocaleString('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return {
    id: data.id,
    sender: data.senderName,
    receiverAddress: data.receiverAddress,
    charge: data.charge,
    status: data.statusString,
    sendDate: formattedSendDate,
    from: data.pickupFromName,
    to: data.pickupToName,
    statusNumber: data.status
  };
}

export async function fetchOrders(tab?: Tab) {
  // noStore();
  // console.log(tab);
  const status = !tab ? '' : 
      tab === 'pending' ? 'pending-transport' :
      tab === 'transported' ? 'pending-delivery' :
      tab === 'incoming' ? 'incoming' : '';

  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pickupstaff/orders?${status ? `status=${status}` : ''}`);
  if (Math.floor(result.status / 100) !== 2) throw new Error(await result.json());
  return (await result.json() as OrderExtended2[]).map(formatData);
}

export async function checkinOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pickupstaff/orders/${id}/checkin`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error((await result.json()).error);
}

export async function checkoutTransportOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pickupstaff/orders/${id}/transportcheckout`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error((await result.json()).error);
}

export async function checkoutDeliveryOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pickupstaff/orders/${id}/deliverycheckout`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error((await result.json()).error);
}

export async function createOrder(postform: FormData) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/pickupstaff/orders`, {
    method: 'POST',
    body: postform
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error((await result.json()).error);
}