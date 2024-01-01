import { HubsIcon, EmployeesIcon, OrdersIcon } from '@/app/ui/common/icons';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
export const links = [
  { name: 'Orders', href: '/home/hubmanager/orders', icon: OrdersIcon },
  { name: 'Employees', href: '/home/hubmanager/employees', icon: EmployeesIcon }
];
