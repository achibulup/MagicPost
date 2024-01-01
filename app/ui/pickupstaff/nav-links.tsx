import { PlusIcon, IncomingIcon, DeliveredIcon, OutgoingIcon,  } from '@/app/ui/common/icons';

export const links = [
  { name: 'Incoming', href: '/home/pickupstaff/incoming', icon: IncomingIcon },
  { name: 'Transported', href: '/home/pickupstaff/transported', icon: DeliveredIcon },
  { name: 'Pending', href: '/home/pickupstaff/pending', icon: OutgoingIcon},
  { name: 'Create order', href: '/home/pickupstaff/create', icon: PlusIcon },
];
