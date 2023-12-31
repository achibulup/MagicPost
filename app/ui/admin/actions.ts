import type { OrderExtended2, AccountExtended } from '@/lib/backend/database/actions';
import type { Facilities } from '@/app/api/admin/facilities/route';

export type OrderInfo = {
  id: number;
  sender: string;
  address: string;
  charge: number;
  status: string;
  sendDate: string;
  from: string;
  to: string;
  statusNumber: number;
}

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
    address: data.receiverAddress,
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
  const data = await result.json() as OrderExtended2[];
  console.log(JSON.stringify(data, null, 2));
  return data.map(formatData);
}

export async function fetchEmployees() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/employees`);
  if (Math.floor(result.status / 100) !== 2) throw new Error(await result.json());
  return await result.json() as AccountExtended[];
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

export async function fetchFacilities() {
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/facilities`);
  if (Math.floor(result.status / 100) !== 2) throw new Error(await result.json());
  return await result.json() as Facilities;
}