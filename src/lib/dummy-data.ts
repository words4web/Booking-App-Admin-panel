export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  unitType: "trip" | "hour" | "load";
  price: number;
  vatApplicable: boolean;
}

export interface Driver {
  id: string;
  name: string;
  status: "available" | "busy" | "offline";
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  status: "assigned" | "accepted" | "on_the_way" | "job_started" | "completed";
  driverId?: string;
  driverName?: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
  totalAmount: number;
}

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Logistics Corp",
    email: "logistics@example.com",
    address: "123 Warehouse Rd",
  },
  {
    id: "2",
    name: "Retail Giant",
    email: "retail@example.com",
    address: "456 Market St",
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Standard Delivery",
    description: "Standard truck delivery",
    unitType: "trip",
    price: 150,
    vatApplicable: true,
  },
  {
    id: "2",
    name: "Hourly Wait",
    description: "Waiting time charge",
    unitType: "hour",
    price: 30,
    vatApplicable: true,
  },
];

export const mockDrivers: Driver[] = [
  { id: "1", name: "John Doe", status: "available" },
  { id: "2", name: "Jane Smith", status: "busy" },
];

export const mockBookings: Booking[] = [
  {
    id: "BK-1001",
    customerId: "1",
    customerName: "Logistics Corp",
    date: "2024-05-20",
    status: "assigned",
    driverId: "1",
    driverName: "John Doe",
    products: [
      {
        productId: "1",
        productName: "Standard Delivery",
        quantity: 1,
        unitPrice: 150,
      },
    ],
    totalAmount: 150,
  },
  {
    id: "BK-1002",
    customerId: "2",
    customerName: "Retail Giant",
    date: "2024-05-21",
    status: "completed",
    driverId: "2",
    driverName: "Jane Smith",
    products: [
      {
        productId: "1",
        productName: "Standard Delivery",
        quantity: 2,
        unitPrice: 150,
      },
    ],
    totalAmount: 300,
  },
];
