import { VercelPoolClient, db } from '@vercel/postgres';
import * as actions from '../lib/database/actions';
import dotenv from 'dotenv';

import data from '../lib/database/placeholder-data.json';
import type { AccountData, OrderData, PackageData, PickupPointData } from '../lib/database/definitions';

// async function createCustomerTable(client: VercelPoolClient) {
//   await client.sql`
//     DROP TABLE IF EXISTS customers CASCADE;
//   `;
//   return client.sql`
//     CREATE TABLE IF NOT EXISTS customers (
//       id SERIAl PRIMARY KEY,
//       name VARCHAR(255) NOT NULL,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       password VARCHAR(255) NOT NULL,
//       phone VARCHAR(255) NOT NULL
//     );
//   `;
// }

// async function seedCustomerTable(client: VercelPoolClient) {
//   await Promise.all(data.customers.map(async (customer) => {
//     return actions.createCustomer(customer);
//   }));
//   console.log("Finished seeding customers");
// }

async function createTransitHubTable(client: VercelPoolClient) {
  await client.sql`
    DROP TABLE IF EXISTS transit_hubs CASCADE;
  `;
  await client.sql`
    CREATE TABLE IF NOT EXISTS transit_hubs (
      id SERIAl PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL
    );
  `;
}

async function seedTransitHubTable(client: VercelPoolClient) {
  await Promise.all(data.transitHubs.map(async (transitHub) => {
    return actions.createTransitHub(transitHub);
  }));
  console.log("Finished seeding transit hubs");
}

async function createPickupPointTable(client: VercelPoolClient) {
  await client.sql`
    DROP TABLE IF EXISTS pickup_points CASCADE;
  `;
  await client.sql`
    CREATE TABLE IF NOT EXISTS pickup_points (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255) NOT NULL,
      hub INTEGER NOT NULL REFERENCES transit_hubs(id)
    );
  `;
}

async function seedPickupPointTable(client: VercelPoolClient) {
  await Promise.all(data.pickupPoints.map(async (pickupPoint) => {
    console.log(JSON.stringify(pickupPoint));
    const formatPickupPoint = { 
      ...pickupPoint, 
      hub: (await actions.getTransitHubByName(pickupPoint.hub)).id 
    };
    return actions.createPickupPoint(formatPickupPoint as PickupPointData);
  }));
  console.log("Finished seeding pickup points");
}

async function createAccountTable(client: VercelPoolClient) {
  await client.sql`
    DROP TABLE IF EXISTS accounts CASCADE;
  `;
  return client.sql`
    CREATE TABLE IF NOT EXISTS accounts (
      id SERIAl PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      status VARCHAR(255) NOT NULL DEFAULT 'active',
      pickup_point INTEGER REFERENCES pickup_points(id),
      transit_hub INTEGER REFERENCES transit_hubs(id)
    );
  `;
}

async function seedAccountTable(client: VercelPoolClient) {
  await Promise.all(data.accounts.map(async (account) => {
    const formatAccount = {
      ...account,
      pickupPoint: account.pickupPoint && (await actions.getPickupPointByName(account.pickupPoint)).id,
      transitHub: account.transitHub && (await actions.getTransitHubByName(account.transitHub)).id,
    };
    return actions.createAccount(formatAccount as AccountData);
  }));
}

async function createPackageTable(client: VercelPoolClient) {
  await client.sql`
    DROP TABLE IF EXISTS packages CASCADE;
  `;
  return client.sql`
    CREATE TABLE IF NOT EXISTS packages (
      id SERIAL PRIMARY KEY,
      quantity INTEGER NOT NULL DEFAULT 0,
      weight FLOAT NOT NULL DEFAULT 0,
      pickup_from INTEGER NOT NULL REFERENCES pickup_points(id),
      pickup_to INTEGER NOT NULL REFERENCES pickup_points(id),
      transit_date DATE,
      arrival_date DATE,
      shipper INTEGER REFERENCES accounts(id),
      status VARCHAR(255) NOT NULL DEFAULT 'pending'
    );
  `;
}

async function seedPackageTable(client: VercelPoolClient) {
  await Promise.all(data.packages.map(async (pk) => {
    const formatpk = { 
      ...pk, 
      pickupFrom: (await actions.getPickupPointByName(pk.pickupFrom)).id,
      pickupTo: (await actions.getPickupPointByName(pk.pickupTo)).id,
      shipper: (await actions.getAccountByEmail(pk.shipper)).id,
      transitDate: pk.transitDate && new Date(pk.transitDate),
      arrivalDate: pk.arrivalDate && new Date(pk.arrivalDate),
    };
    return actions.createPackage(formatpk as PackageData);
  }));
}

async function createOrderTable(client: VercelPoolClient) {
  await client.sql`
    DROP TABLE IF EXISTS orders CASCADE;
  `;
  return client.sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      weight FLOAT NOT NULL DEFAULT 0,
      sender INTEGER NOT NULL REFERENCES customers(id),
      receiver_number VARCHAR(255) NOT NULL,
      receiver_address VARCHAR(255) NOT NULL,
      pickup_from INTEGER NOT NULL REFERENCES pickup_points(id),
      pickup_to INTEGER NOT NULL REFERENCES pickup_points(id),
      send_date DATE,
      arrival_date DATE,
      shipper INTEGER REFERENCES accounts(id),
      status VARCHAR(255) NOT NULL DEFAULT 'pending'
    );
  `;
}

async function seedOrderTable(client: VercelPoolClient) {
  await Promise.all(data.orders.map(async (order) => {
    const formatOrder = { 
      ...order, 
      pickupFrom: (await actions.getPickupPointByName(order.pickupFrom)).id,
      pickupTo: (await actions.getPickupPointByName(order.pickupTo)).id,
      shipper: order.shipper && (await actions.getAccountByEmail(order.shipper)).id,
      sendDate: order.sendDate && new Date(order.sendDate),
      arrivalDate: order.arrivalDate && new Date(order.arrivalDate),
    };
    return actions.createOrder(formatOrder as OrderData);
  }));
  console.log("Finished seeding orders");
}

async function main() {
  const client = await db.connect();

  await Promise.all([
    createTransitHubTable(client),
    createPickupPointTable(client),
    createAccountTable(client),
    createPackageTable(client),
    createOrderTable(client),
  ]);

  console.log("Finished creating tables");

  await seedTransitHubTable(client);
  await seedPickupPointTable(client);
  await seedAccountTable(client);
  await seedPackageTable(client);
  await seedOrderTable(client);

  console.log("Finished seeding tables");

  client.release();
}

export default main;