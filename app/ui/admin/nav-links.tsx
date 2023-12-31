import { HubsIcon, EmployeesIcon, OrdersIcon } from '@/app/ui/common/icons';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
export const links = [
  { name: 'Hubs', href: '/home/admin/hubs', icon: HubsIcon },
  { name: 'Orders', href: '/home/admin/orders', icon: OrdersIcon },
  { name: 'Employees', href: '/home/admin/employees', icon: EmployeesIcon }
];
