type Account = {
  id: number;
  email: string;
  name: string;
  password: string;
  phone: string;
  status: "active" | "inactive";
} & (
  {
    role: "staff" | "manager" | "shipper";
    pickupPoint: number;
    transitHub?: null;
  } | {
    role: "staff" | "manager";
    pickupPoint?: null;
    transitHub: number;
  } | {
    role: "customer" | "director";
    pickupPoint?: null;
    transitHub?: null;
  }
);

type Order = { 
  id: number;
  weight: number;
  sender: number;
  receiverNumber: string;
  receiverAddress: string;
  pickupFrom: number;
  pickupTo: number;
  charge: number;
  status: number; // -1 mean cancelled, from 2 to 10: odd number mean in transit, even number mean in pickup point
  sendDate: Date;
  arrivalDate: Date | null;
  shipper: number | null;
};

type PickupPoint = {
  id: number;
  name: string;
  location: string;
  hub: number;
};

type TransitHub = {
  id: number;
  name: string;
  location: string;
};




type CustomerData = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

type AccountData = {
  email: string;
  name: string;
  password: string;
  phone: string;
  status?: "active" | "inactive";
} & (
  {
    role: "staff" | "manager" | "shipper";
    pickupPoint: number;
    transitHub?: null;
  } | {
    role: "staff" | "manager";
    pickupPoint?: null;
    transitHub: number;
  } | {
    role: "customer" | "director";
    pickupPoint?: null;
    transitHub?: null;
  }
);

type OrderData = {
  sender: number;
  weight: number;
  receiverNumber: string;
  receiverAddress: string;
  pickupFrom: number;
  pickupTo: number;
  sendDate: Date;
  charge: number;
  shipper?: number | null;
  arrivalDate?: Date | null;
  status?: number;
};

// type PackageData = {
//   quantity?: number;
//   weight?: number;
//   pickupFrom: number;
//   pickupTo: number;
//   transitDate?: Date | null;
//   arrivalDate?: Date | null;
//   status?: "pending" | "delivering1" | "delivering2" | "delivering3" | "delivered";
// }

type TransitHubData = {
  name: string;
  location: string;
};

type PickupPointData = {
  name: string;
  location: string;
  hub: number;
};

export type { Account, Order, PickupPoint, TransitHub, CustomerData, AccountData, OrderData, TransitHubData, PickupPointData };