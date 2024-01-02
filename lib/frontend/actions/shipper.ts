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

export type Tab = "ready" | "delivering" | "delivered" | "cancelled";

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
  // noStore();
  // console.log(tab);
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipper/orders?${tab ? `status=${tab}` : ''}`);
  if (Math.floor(result.status / 100) !== 2) throw new Error((await result.json()).error);
  return (await result.json() as OrderExtended2[]).map(formatData);
}

export async function acceptOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipper/orders/${id}/accept`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error((await result.json()).error);
}

export async function confirmOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipper/orders/${id}/confirm`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error((await result.json()).error);
}

export async function cancelOrder(id: number) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/shipper/orders/${id}/cancel`, {
    method: 'POST'
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error(JSON.stringify(await result.json()));
}