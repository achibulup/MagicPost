import bcrypt from 'bcryptjs';
import { sql } from '@vercel/postgres';
import type { Account, Order, PickupPoint, TransitHub, AccountData, CustomerData, OrderData, PickupPointData, TransitHubData } from './definitions';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

// export async function createCustomer({ name, email, password, phone }: CustomerData) {
//   return sql`
//     INSERT INTO customers (name, email, password, phone)
//     VALUES (${name}, ${email}, ${password}, ${phone})
//   `;
// }

type EmployeeFilter = {
  name?: string;
  email?: string;
  role?: string;
  pickupPoint?: number;
  transitHub?: number;
};

export type OrderFilter = {
  id?: number;
  sender?: number;
  receiverNumber?: string;
  receiverAddress?: string;
  shipper?: number | null;
  status?: number;
  hub?: number;
  pickup?: number;
  pickupFrom?: number;
  hubFrom?: number;
  pickupTo?: number;
  hubTo?: number;
};
  

// export async function getCustomerById(id: number) {
//   return sql<Customer>`
//     SELECT * FROM customers WHERE id = ${id}
//   `.then((res) => res.rows[0]);
// }

// export async function getCustomerByEmail(email: string) {
//   return sql<Customer>`
//     SELECT * FROM customers WHERE email = ${email}
//   `.then((res) => res.rows[0]);
// }

// export async function changeCustomerPassword(id: number, newPassword: string) {
//   const hashedPassword = await hashPassword(newPassword);
//   return sql`
//     UPDATE customers
//     SET password = ${hashedPassword}
//     WHERE id = ${id}
//   `;
// }

// export async function deleteCustomer(id: number) {
//   return sql`
//     DELETE FROM customers WHERE id = ${id}
//   `;
// }

export async function createAccount({
  name,
  email,
  password,
  phone,
  role,
  pickupPoint,
  transitHub,
}: AccountData) {
  const hashedPassword = await hashPassword(password);
  return sql`
    INSERT INTO "accounts" ("name", "email", "password", "phone", "role", "pickupPoint", "transitHub")
    VALUES (${name}, ${email}, ${hashedPassword}, ${phone}, ${role}, ${pickupPoint}, ${transitHub})
  `;
}

export async function getAccountById(id: number) {
  return sql<Account>`
    SELECT * FROM "accounts" WHERE "id" = ${id}
  `.then((res) => res.rows[0]);
}

export async function getAccountByEmail(email: string) {
  return sql<Account>`
    SELECT * FROM "accounts" WHERE "email" = ${email}
  `.then((res) => res.rows[0]);
}

export async function getEmployees(filter: EmployeeFilter) {
  const { name, email, role, pickupPoint, transitHub } = filter;
  const doFilterName = name ? 1 : 0;
  const doFilterEmail = email ? 1 : 0;
  const doFilterRole = role ? 1 : 0;
  const doFilterPickupPoint = pickupPoint ? 1 : 0;
  const doFilterTransitHub = transitHub ? 1 : 0;
  return sql<Account>`
    SELECT a."id", a."name", a."email", a."role", a."pickupPoint", a."transitHub" FROM "accounts" a
    WHERE 
      (${doFilterName} = 0 OR "name" = ${name}) AND
      (${doFilterEmail} = 0 OR "email" = ${email}) AND
      (${doFilterRole} = 0 OR "role" = ${role}) AND
      (${doFilterPickupPoint} = 0 OR "pickupPoint" = ${pickupPoint}) AND
      (${doFilterTransitHub} = 0 OR "transitHub" = ${transitHub}) 
  `.then((res) => res.rows);
}

export async function updateAccount(id: number, { name, email, phone, role }:
{
  name?: string,
  email?: string,
  phone?: string,
  role?: string,
}) {
  const doUpdateName = name ? 1 : 0;
  const doUpdateEmail = email ? 1 : 0;
  const doUpdatePhone = phone ? 1 : 0;
  const doUpdateRole = role ? 1 : 0;
  const promises = [];
  if (doUpdateName) {
    promises.push(sql`
      UPDATE "accounts"
      SET "name" = ${name}
      WHERE "id" = ${id}
    `);
  }
  if (doUpdateEmail) {
    promises.push(sql`
      UPDATE "accounts"
      SET "email" = ${email}
      WHERE "id" = ${id}
    `);
  }
  if (doUpdatePhone) {
    promises.push(sql`
      UPDATE "accounts"
      SET "phone" = ${phone}
      WHERE "id" = ${id}
    `);
  }
  if (doUpdateRole) {
    promises.push(sql`
      UPDATE "accounts"
      SET "role" = ${role}
      WHERE "id" = ${id}
    `);
  }
  await Promise.all(promises);
}

export async function changeAccountPassword(id: number, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  return sql`
    UPDATE "accounts"
    SET "password" = ${hashedPassword}
    WHERE "id" = ${id}
  `;
}

export async function setAccountStatus(id: number, status: string) {
  return sql`
    UPDATE "accounts"
    SET "status" = ${status}
    WHERE "id" = ${id}
  `;
}

type OrderExtended = Order & {
  senderName: string,
  hubFrom: number,
  hubTo: number,
  pickupFromName: string,
  pickupToName: string,
  hubFromName: string,
  hubToName: string,
};

export type OrderExtended2 = OrderExtended & {
  statusString: string,
};

export function statusString(order: OrderExtended) {
  if (order.status != Math.floor(order.status)) return 'Invalid';
  if (order.status === -1) return 'Cancelled';
  if (order.status === 2) return 'Pending Transport';
  if (order.status === 3) return `Transporting from ${order.pickupFromName} to ${order.hubFromName}`;
  if (order.status === 4) return `At ${order.hubFromName}`;
  if (order.status === 5) return `Transporting from ${order.hubFromName} to ${order.hubToName}`;
  if (order.status === 6) return `At ${order.hubToName}`;
  if (order.status === 7) return `Transporting from ${order.hubToName} to ${order.pickupToName}`;
  if (order.status === 8) return 'Transported';
  if (order.status === 9) return 'Ready';
  if (order.status === 10) return 'Delivering';
  if (order.status === 11) return 'Delivered';
  return 'Invalid';
}

function reformatOrder(order: OrderExtended): OrderExtended2
{
    return {
      ...order, 
      sendDate: new Date(order.sendDate), 
      arrivalDate: order.arrivalDate ? new Date(order.arrivalDate) : null,
      statusString: statusString(order)
    };
}

export async function createOrder({
  sender,
  weight,
  receiverNumber,
  receiverAddress,
  pickupFrom,
  pickupTo,
  sendDate,
  arrivalDate,
  charge,
  shipper,
  status
}: OrderData) {
  const formattedSendDate = sendDate.toISOString();
  const formattedArrivalDate = arrivalDate ? arrivalDate.toISOString() : null;
  status = status || 2;
  return sql`
    INSERT INTO "orders" ("sender", "weight", "receiverNumber", "receiverAddress", "pickupFrom", "pickupTo", "shipper", "sendDate", "arrivalDate", "charge", "status")
    VALUES (${sender}, ${weight}, ${receiverNumber}, ${receiverAddress}, ${pickupFrom}, ${pickupTo}, 
            ${shipper}, ${formattedSendDate}, ${formattedArrivalDate}, ${charge}, ${status})
  `;
}

export async function getOrderById(id: number) {
  return sql<OrderExtended>`
    SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
    FROM "orders" o
    JOIN "accounts" s ON s."id" = o."sender"
    JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
    JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
    JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
    JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
    WHERE o."id" = ${id}
  `.then((res) => (res.rows[0] && reformatOrder(res.rows[0])) as OrderExtended | undefined);
}

export async function getOrders(filter: OrderFilter) : Promise<Order[] | (OrderExtended)[]> {
  const { id, sender, receiverNumber, receiverAddress, hub, hubFrom, hubTo, pickup, pickupFrom, pickupTo, shipper, status } = filter;
  const doFilterId = id !== undefined ? 1 : 0;
  const doFilterSender = sender !== undefined ? 1 : 0;
  const doFilterReceiverNumber = receiverNumber !== undefined ? 1 : 0;
  const doFilterReceiverAddress = receiverAddress !== undefined ? 1 : 0;
  const doFilterHub = hub !== undefined ? 1 : 0;
  const doFilterHubFrom = hubFrom !== undefined ? 1 : 0;
  const doFilterHubTo = hubTo !== undefined ? 1 : 0;
  const doFilterPickup = pickup !== undefined ? 1 : 0;
  const doFilterPickupFrom = pickupFrom !== undefined ? 1 : 0;
  const doFilterPickupTo = pickupTo !== undefined ? 1 : 0;
  const doFilterShipper = shipper !== undefined ? 1 : 0;
  const doFilterStatus = status !== undefined ? 1 : 0;
  console.log(doFilterId, doFilterSender, doFilterReceiverNumber, doFilterReceiverAddress, doFilterHub, doFilterHubFrom, doFilterHubTo, doFilterPickup, doFilterPickupFrom, doFilterPickupTo, doFilterShipper, doFilterStatus);
  if (doFilterHub) {
    return sql<OrderExtended>`
      SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
      FROM "orders" o
      JOIN "accounts" s ON s."id" = o."sender"
      JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
      JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
      JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
      JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
      WHERE
        (pp1."hub" = ${hub} OR pp2."hub" = ${hub}) AND
        (${doFilterId} = 0 OR o."id" = ${id}) AND
        (${doFilterSender} = 0 OR "sender" = ${sender}) AND
        (${doFilterReceiverNumber} = 0 OR "receiverNumber" = ${receiverNumber}) AND
        (${doFilterReceiverAddress} = 0 OR "receiverAddress" = ${receiverAddress}) AND
        (${doFilterShipper} = 0 OR "shipper" = ${shipper}) AND
        (${doFilterStatus} = 0 OR o."status" = ${status})
      ORDER BY "sendDate" DESC
    `.then((res) => res.rows.map(reformatOrder));
  } else if (doFilterPickup) {
    return sql<OrderExtended>`
    SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
    FROM "orders" o
    JOIN "accounts" s ON s."id" = o."sender"
    JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
    JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
    JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
    JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
    WHERE
        ("pickupFrom" = ${pickup} OR "pickupTo" = ${pickup}) AND
        (${doFilterId} = 0 OR o."id" = ${id}) AND
        (${doFilterSender} = 0 OR "sender" = ${sender}) AND
        (${doFilterReceiverNumber} = 0 OR "receiverNumber" = ${receiverNumber}) AND
        (${doFilterReceiverAddress} = 0 OR "receiverAddress" = ${receiverAddress}) AND
        (${doFilterShipper} = 0 OR "shipper" = ${shipper}) AND
        (${doFilterStatus} = 0 OR o."status" = ${status})
      ORDER BY "sendDate" DESC
    `.then((res) => res.rows.map(reformatOrder));
  } else {
    if (doFilterHubFrom) {
      if (doFilterHubTo) {
        return sql<OrderExtended>`
          SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
          FROM "orders" o
          JOIN "accounts" s ON s."id" = o."sender"
          JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
          JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
          JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
          JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
          WHERE
            pp1."hub" = ${hubFrom} AND pp2."hub" = ${hubTo} AND
            (${doFilterId} = 0 OR o."id" = ${id}) AND
            (${doFilterSender} = 0 OR "sender" = ${sender}) AND
            (${doFilterReceiverNumber} = 0 OR "receiverNumber" = ${receiverNumber}) AND
            (${doFilterReceiverAddress} = 0 OR "receiverAddress" = ${receiverAddress}) AND
            (${doFilterShipper} = 0 OR "shipper" = ${shipper}) AND
            (${doFilterStatus} = 0 OR o."status" = ${status})
          ORDER BY "sendDate" DESC
        `.then((res) => res.rows.map(reformatOrder));
      } else {
        return sql<OrderExtended>`
          SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
          FROM "orders" o
          JOIN "accounts" s ON s."id" = o."sender"
          JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
          JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
          JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
          JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
          WHERE
            pp1."hub" = ${hubFrom} AND
            (${doFilterPickupTo} = 0 OR "pickupTo" = ${pickupTo}) AND
            (${doFilterId} = 0 OR o."id" = ${id}) AND
            (${doFilterSender} = 0 OR "sender" = ${sender}) AND
            (${doFilterReceiverNumber} = 0 OR "receiverNumber" = ${receiverNumber}) AND
            (${doFilterReceiverAddress} = 0 OR "receiverAddress" = ${receiverAddress}) AND
            (${doFilterShipper} = 0 OR "shipper" = ${shipper}) AND
            (${doFilterStatus} = 0 OR o."status" = ${status})
          ORDER BY "sendDate" DESC
        `.then((res) => res.rows.map(reformatOrder));
      }
    } else {
      if (doFilterHubTo) {
        return sql<OrderExtended>`
          SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
          FROM "orders" o
          JOIN "accounts" s ON s."id" = o."sender"
          JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
          JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
          JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
          JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
          WHERE
            pp2."hub" = ${hubTo} AND
            (${doFilterPickupFrom} = 0 OR "pickupFrom" = ${pickupFrom}) AND
            (${doFilterId} = 0 OR o."id" = ${id}) AND
            (${doFilterSender} = 0 OR "sender" = ${sender}) AND
            (${doFilterReceiverNumber} = 0 OR "receiverNumber" = ${receiverNumber}) AND
            (${doFilterReceiverAddress} = 0 OR "receiverAddress" = ${receiverAddress}) AND
            (${doFilterShipper} = 0 OR "shipper" = ${shipper}) AND
            (${doFilterStatus} = 0 OR o."status" = ${status})
          ORDER BY "sendDate" DESC
        `.then((res) => res.rows.map(reformatOrder));
      } else {
        return sql<OrderExtended>`
          SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
          FROM "orders" o
          JOIN "accounts" s ON s."id" = o."sender"
          JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
          JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
          JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
          JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
          WHERE 
            (${doFilterPickupFrom} = 0 OR "pickupFrom" = ${pickupFrom}) AND
            (${doFilterPickupTo} = 0 OR "pickupTo" = ${pickupTo}) AND
            (${doFilterId} = 0 OR o."id" = ${id}) AND
            (${doFilterSender} = 0 OR "sender" = ${sender}) AND
            (${doFilterReceiverNumber} = 0 OR "receiverNumber" = ${receiverNumber}) AND
            (${doFilterReceiverAddress} = 0 OR "receiverAddress" = ${receiverAddress}) AND
            (${doFilterShipper} = 0 OR "shipper" = ${shipper}) AND
            (${doFilterStatus} = 0 OR o."status" = ${status})
          ORDER BY "sendDate" DESC
        `.then((res) => res.rows.map(reformatOrder));
      }
    }
  }
}

export async function getTransportingOrders(customer: number) {
  return sql<OrderExtended>`
    SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
    FROM "orders" o
    JOIN "accounts" s ON s."id" = o."sender"
    JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
    JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
    JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
    JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
    WHERE
      "sender" = ${customer} AND
      o."status" < 9 AND o."status" > 1
    ORDER BY "sendDate" DESC
  `.then((res) => res.rows.map(reformatOrder));
}

export async function getDeliveringOrders(customer: number) {
  return sql<OrderExtended>`
    SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
    FROM "orders" o
    JOIN "accounts" s ON s."id" = o."sender"
    JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
    JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
    JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
    JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
    WHERE
      "sender" = ${customer} AND
      o."status" < 11 AND o."status" > 8
    ORDER BY "sendDate" DESC
  `.then((res) => res.rows.map(reformatOrder));
}

export async function getDeliveredOrders(customer: number) {
  return sql<OrderExtended>`
    SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
    FROM "orders" o
    JOIN "accounts" s ON s."id" = o."sender"
    JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
    JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
    JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
    JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
    WHERE
      "sender" = ${customer} AND
      o."status" = 11
    ORDER BY "sendDate" DESC
  `.then((res) => res.rows.map(reformatOrder));
}

export async function getCancelledOrders(customer: number) {
  return sql<OrderExtended>`
    SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
    FROM "orders" o
    JOIN "accounts" s ON s."id" = o."sender"
    JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
    JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
    JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
    JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
    WHERE
      "sender" = ${customer} AND
      o."status" = -1
    ORDER BY "sendDate" DESC
  `.then((res) => res.rows.map(reformatOrder));
}

export async function getOrdersByHub(hub: number, kind?: 'incoming' | 'outgoing') {
  const acceptIncoming = (kind === 'incoming' || !kind) ? 1 : 0;
  const acceptOutgoing = (kind === 'outgoing' || !kind) ? 1 : 0;
  console.log(hub)
  console.log(acceptIncoming, acceptOutgoing);
  return sql<OrderExtended>`
    SELECT o.*, s."name" as "senderName", pp1."hub" as "hubFrom", pp2."hub" as "hubTo", pp1."name" as "pickupFromName", pp2."name" as "pickupToName", h1."name" as "hubFromName", h2."name" as "hubToName" 
    FROM "orders" o
    JOIN "accounts" s ON s."id" = o."sender"
    JOIN "pickupPoints" pp1 ON o."pickupFrom" = pp1."id"
    JOIN "pickupPoints" pp2 ON o."pickupTo" = pp2."id"
    JOIN "transitHubs" h1 ON h1."id" = pp1."hub"
    JOIN "transitHubs" h2 ON h2."id" = pp2."hub"
    WHERE
      (${acceptIncoming} = 1 AND pp1."hub" = ${hub} AND o."status" = 3) OR
      (${acceptIncoming} = 1 AND pp2."hub" = ${hub} AND o."status" = 5) OR
      (${acceptOutgoing} = 1 AND pp1."hub" = ${hub} AND o."status" = 4) OR
      (${acceptOutgoing} = 1 AND pp2."hub" = ${hub} AND o."status" = 6)
    ORDER BY "sendDate" DESC
  `.then((res) => res.rows.map(reformatOrder));
}


export async function setOrderStatus(id: number, status: number) {
  return sql`
    UPDATE "orders"
    SET "status" = ${status}
    WHERE "id" = ${id}
  `;
}

export async function setOrderShipper(id: number, shipper?: number | null) {
  return sql`
    UPDATE "orders"
    SET "shipper" = ${shipper}, "status" = 10
    WHERE "id" = ${id}
  `;
}

export async function orderDelivered(id: number, arrivalDate: Date) {
  const formattedArrivalDate = arrivalDate.toISOString();
  return sql`
    UPDATE "orders"
    SET "status" = 11, "arrivalDate" = ${formattedArrivalDate}
    WHERE "id" = ${id}
  `;
}

export async function orderCancelled(id: number) {
  return sql`
    UPDATE "orders"
    SET "status" = -1
    WHERE "id" = ${id}
  `;
}

// function reformatPackage<P extends Package>(pk: P) : P
// {
//     return {
//       ...pk, 
//       transitDate: pk.transitDate ? new Date(pk.transitDate) : null, 
//       arrivalDate: pk.arrivalDate ? new Date(pk.arrivalDate) : null
//     };
// }

// export async function createPackage({
//   pickupFrom,
//   pickupTo,
//   transitDate,
//   arrivalDate,
//   status,
// }: PackageData) {
//   const formattedTransitDate = transitDate ? transitDate.toISOString() : null;
//   const formattedArrivalDate = arrivalDate ? arrivalDate.toISOString() : null;
//   status = status || "pending";
//   return sql`
//     INSERT INTO "packages" ("pickupFrom", "pickupTo", "transitDate", "arrivalDate", "status")
//     VALUES (${pickupFrom}, ${pickupTo}, ${formattedTransitDate}, ${formattedArrivalDate}, ${status}) RETURNING "id"
//   `.then((res) => res.rows[0].id as number);
// }

// export async function getPackages(filter: PackageFilter): Promise<Package[] | (Package & { hubFrom: number, hubTo: number })[]> {
//   const { id, pickup, pickupFrom, pickupTo, hub, hubFrom, hubTo, status } = filter as {
//     pickup?: number;
//     pickupFrom?: number;
//     pickupTo?: number;
//     hub?: number;
//     hubFrom?: number;
//     hubTo?: number;
//     id?: number;
//     status?: string;
//   };
//   const doFilterId = id ? 1 : 0;
//   const doFilterPickup = pickup ? 1 : 0;
//   const doFilterPickupFrom = pickupFrom ? 1 : 0;
//   const doFilterPickupTo = pickupTo ? 1 : 0;
//   const doFilterHub = hub ? 1 : 0;
//   const doFilterHubFrom = hubFrom ? 1 : 0;
//   const doFilterHubTo = hubTo ? 1 : 0;
//   const doFilterStatus = status ? 1 : 0;
//   if (doFilterHub) {
//     return sql<Package & { hubFrom: number, hubTo: number}>`
//       SELECT p.*, pp1.hub as "hubFrom", pp2.hub as "hubTo" FROM "packages" p
//       JOIN "pickupPoints" pp1 ON p."pickupFrom" = pp1.id
//       JOIN "pickupPoints" pp2 ON p."pickupTo" = pp2.id 
//       WHERE
//         (pp1."hub" = ${hubFrom} OR pp2."hub" = ${hubTo}) AND
//         (${doFilterId} = 0 OR "id" = ${id}) AND
//         (${doFilterStatus} = 0 OR "status" = ${status})
//       ORDER BY "transitDate" DESC
//     `.then((res) => res.rows.map(reformatPackage));
//   } else if (doFilterPickup) {
//     return sql<Package>`
//       SELECT p.* FROM "packages" p
//       WHERE
//         (p."pickupFrom" = ${pickup} OR p."pickupTo" = ${pickup}) AND
//         (${doFilterId} = 0 OR "id" = ${id}) AND
//         (${doFilterStatus} = 0 OR "status" = ${status})
//       ORDER BY "transitDate" DESC
//     `.then((res) => res.rows.map(reformatPackage));
//   } else if (doFilterHubFrom) {
//     if (doFilterHubTo) {
//       return sql<Package>`
//         SELECT p.* FROM "packages" p
//         JOIN "pickupPoints" pp1 ON p."pickupFrom" = pp1.id
//         JOIN "pickupPoints" pp2 ON p."pickupTo" = pp2.id 
//         WHERE
//           pp1."hub" = ${hubFrom} AND pp2."hub" = ${hubTo} AND
//           (${doFilterId} = 0 OR "id" = ${id}) AND
//           (${doFilterStatus} = 0 OR "status" = ${status})
//         ORDER BY "transitDate" DESC
//       `.then((res) => res.rows.map(reformatPackage));
//     } else {
//       return sql<Package>`
//         SELECT p.* FROM "packages" p
//         JOIN "pickupPoints" pp1 ON p."pickupFrom" = pp1.id
//         WHERE
//           pp1."hub" = ${hubFrom} AND
//           (${doFilterPickupTo} = 0 OR "pickupTo" = ${pickupTo}) AND
//           (${doFilterId} = 0 OR "id" = ${id})
//           (${doFilterStatus} = 0 OR "status" = ${status})
//         ORDER BY "transitDate" DESC
//       `.then((res) => res.rows.map(reformatPackage));
//     }
//   } else {
//     if (doFilterHubTo) {
//       return sql<Package>`
//         SELECT p.* FROM "packages" p
//         JOIN "pickupPoints" pp2 ON p."pickupTo" = pp2.id 
//         WHERE
//           pp2."hub" = ${hubTo} AND
//           (${doFilterPickupFrom} = 0 OR "pickupFrom" = ${pickupFrom}) AND
//           (${doFilterId} = 0 OR "id" = ${id}) AND
//           (${doFilterStatus} = 0 OR "status" = ${status})
//         ORDER BY "transitDate" DESC
//       `.then((res) => res.rows.map(reformatPackage));
//     } else {
//       return sql<Package>`
//         SELECT p.* FROM "packages"
//         WHERE 
//           (${doFilterPickupFrom} = 0 OR "pickupFrom" = ${pickupFrom}) AND
//           (${doFilterPickupTo} = 0 OR "pickupTo" = ${pickupTo}) AND
//           (${doFilterId} = 0 OR "id" = ${id}) AND
//           (${doFilterStatus} = 0 OR "status" = ${status})
//         ORDER BY "transitDate" DESC
//       `.then((res) => res.rows.map(reformatPackage));
//     }
//   }
// }

// export async function getPackageById(id: number) {
//   return sql<Package>`
//     SELECT * FROM "packages" WHERE "id" = ${id}
//   `.then((res) => reformatPackage(res.rows[0]));
// }

// export async function addOrderToPackage(orderId: number, packageId: number) {
//   return Promise.all([sql`
//     UPDATE "orders"
//     SET "package" = ${packageId}
//     WHERE "id" = ${orderId}
//   `, sql`
//     UPDATE "packages"
//     SET "quantity" = "quantity" + 1, "weight" = "weight" + (SELECT "weight" FROM "orders" WHERE "id" = ${orderId})
//     WHERE "id" = ${packageId}
//   `]);
// }

// export async function setPackageStatus(id: number, status: string, transitDate?: Date) {
//   if (transitDate) {
//     const formattedTransitDate = transitDate.toISOString();
//     return sql`
//       UPDATE "packages"
//       SET "status" = ${status}, "transitDate" = ${formattedTransitDate}
//       WHERE "id" = ${id}
//     `;
//   } else {
//     return sql`
//       UPDATE "packages"
//       SET "status" = ${status}
//       WHERE "id" = ${id}
//     `;
//   }
// }

// export async function packageDelivering1(id: number, transitDate: Date) {
//   const formattedTransitDate = transitDate.toISOString();
//   return sql`
//     UPDATE "packages"
//     SET "status" = 'delivering1', "transitDate" = ${formattedTransitDate}
//     WHERE "id" = ${id}
//   `.then(async () => sql`
//     UPDATE "orders"
//     SET "status" = 'delivering1'
//     WHERE "package" = ${id}
//   `);
// }

// export async function packageDelivering2(id: number) {
//   return sql`
//     UPDATE "packages"
//     SET "status" = 'delivering2'
//     WHERE "id" = ${id}
//   `;
// }

// export async function packageDelivering3(id: number) {
//   return sql`
//     UPDATE "packages"
//     SET "status" = 'delivering3'
//     WHERE "id" = ${id}
//   `;
// }

// export async function packageDelivered(id: number, arrivalDate: Date) {
//   const formattedArrivalDate = arrivalDate.toISOString();
//   return sql`
//     UPDATE "packages"
//     SET "status" = 'delivered', "arrivalDate" = ${formattedArrivalDate}
//     WHERE "id" = ${id}
//   `.then(async () => sql`
//     UPDATE "orders"
//     SET "status" = 'delivering2'
//     WHERE "package" = ${id}
//   `);
// }

export async function createTransitHub({ name, location }: TransitHubData) {
  return sql`
    INSERT INTO "transitHubs" ("name", "location")
    VALUES (${name}, ${location})
  `.then(async () => console.log(await getTransitHubByName(name)));
}

export async function getIncomingOrdersByHub(hub: number) {
  return sql<{ num: number }>`
    SELECT COUNT(*) as "num" FROM "orders" o
    JOIN "pickupPoints" pp ON o."pickupFrom" = pp."id"
    WHERE pp."hub" = ${hub}
  `.then((res) => res.rows[0].num);
}

export async function getOutgoingOrdersByHub(hub: number) {
  return sql<{ num: number }>`
    SELECT COUNT(*) as "num" FROM "orders" o
    JOIN "pickupPoints" pp ON o."pickupTo" = pp."id"
    WHERE pp."hub" = ${hub}
  `.then((res) => res.rows[0].num);
}

export async function getAllTransitHubs() {
  return sql<TransitHub>`
    SELECT *  FROM "transitHubs"
  `.then((res) => res.rows);
}

export async function getTransitHubById(id: number) {
  return sql<TransitHub>`
    SELECT * FROM "transitHubs" WHERE "id" = ${id}
  `.then((res) => res.rows[0]);
}

export async function getTransitHubByName(name: string) {
  console.log('getTransitHubByName', name);
  return sql<TransitHub>`
    SELECT * FROM "transitHubs" WHERE "name" = ${name}
  `.then((res) => res.rows[0]);
}

export async function createPickupPoint({ name, location, hub }: PickupPointData) {
  return sql`
    INSERT INTO "pickupPoints" ("name", "location", "hub")
    VALUES (${name}, ${location}, ${hub})
  `;
}

export async function getPickupPointById(id: number) {
  return sql<PickupPoint>`
    SELECT * FROM "pickupPoints" WHERE "id" = ${id}
  `.then((res) => res.rows[0]);
}

export async function getPickupPointByName(name: string) {
  return sql<PickupPoint>`
    SELECT * FROM "pickupPoints" WHERE "name" = ${name}
  `.then((res) => res.rows[0]);
}

export async function getAllPickupPoints() {
  return sql<PickupPoint>`
    SELECT * FROM "pickupPoints"
  `.then((res) => res.rows);
}

export async function getIncomingOrdersByPickupPoint(pickupPoint: number) {
  return sql<{ num: number }>`
    SELECT COUNT(*) as "num" FROM "orders" o
    WHERE o."pickupTo" = ${pickupPoint}
  `.then((res) => res.rows[0].num);
}

export async function getOutgoingOrdersByPickupPoint(pickupPoint: number) {
  return sql<{ num: number }>`
    SELECT COUNT(*) as "num" FROM "orders" o
    WHERE o."pickupFrom" = ${pickupPoint}
  `.then((res) => res.rows[0].num);
}

export async function getCustomersByPickupPoint(pickupPoint: number) {
  return sql<Account>`
    SELECT "a".* FROM "accounts" "a" JOIN "orders" "o" ON "o"."sender" = "a"."id" 
    WHERE "o"."pickupFrom" = ${pickupPoint}
  `.then((res) => res.rows);
}

export async function getRevenueByPickupPoint(pickupPoint: number, dateRange?: [Date] | [Date, Date]) {
  if (dateRange) {
    let [start, end] = dateRange;
    if (!end) end = new Date();
    return sql`
      SELECT SUM("charge") FROM "orders"
      WHERE "pickupFrom" = ${pickupPoint} AND "status" = 'delivered' 
      AND "sendDate" >= ${start.toISOString()} 
      AND "sendDate" <= ${end.toISOString()}
    `.then((res) => res.rows[0]);
  }
  return sql`
    SELECT SUM("charge") FROM "orders"
    WHERE "pickupFrom" = ${pickupPoint} AND "status" = 'delivered'
  `.then((res) => res.rows[0]);
}