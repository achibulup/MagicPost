import type { OrderExtended2 } from '@/lib/backend/database/actions';

import type { Hubs, PickupPointInfo, TransitHubInfo } from '@/app/api/admin/hubs/route';

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

type EmployeeInfo = {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  pickupPoint: string;
  transitHub: string;
}

type HubInfo = {
  id: number;
  name: string;
  address: string;
  
}

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

export async function fetchOrders() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/orders`);
  if (Math.floor(result.status / 100) !== 2) throw new Error(await result.json());
  return (await result.json() as OrderExtended2[]).map(formatData);
}

export async function fetchEmployees() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/employees`);
  if (Math.floor(result.status / 100) !== 2) throw new Error(await result.json());
  return await result.json();
}

export async function changeEmployee(employeeId: number, postform: FormData) {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/driector/orders/${employeeId}`, {
    method: 'PATCH',
    body: postform
  });
  if (Math.floor(result.status / 100) === 2) {
    return true;
  } else throw new Error(await result.json());
}

export async function fetchHubs() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/hubs`);
  if (Math.floor(result.status / 100) !== 2) throw new Error(await result.json());
  return await result.json() as Hubs;
}