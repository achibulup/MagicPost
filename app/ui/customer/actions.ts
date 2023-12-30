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
}

export type { OrderInfo };

export type Tab = "transporting" | "delivering" | "delivered" | "cancelled";

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
    sendDate: formattedSendDate
  };
}

export async function fetchOrders(tab?: Tab) {
  noStore();
  // console.log(tab);
  const result = await fetch(`http://localhost:3000/api/orders?${tab ? `status=${tab}` : ''}`);
  if (result.status !== 200) throw new Error(await result.json());
  return (await result.json() as OrderExtended2[]).map(formatData);
}