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

export type Tab = "incoming" | "pending";

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
  const status = tab === 'pending' ? 'outgoing' : tab;
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubstaff/orders?${status ? `status=${status}` : ''}`);
  if (result.status !== 200) throw new Error(await result.json());
  return (await result.json() as OrderExtended2[]).map(formatData);
}

export async function checkinOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubstaff/orders/${id}/checkin`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error(await result.json());
}

export async function checkoutOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/hubstaff/orders/${id}/checkout`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error(await result.json());
}
