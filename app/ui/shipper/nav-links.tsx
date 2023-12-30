import { CancelledIcon, DeliveredIcon, DeliveringIcon, TransportedIcon } from '@/app/ui/common/icons';

export const links = [
  { name: 'Ready', href: '/home/shipper/ready', icon: TransportedIcon },
  { name: 'Delivering', href: '/home/shipper/delivering', icon: DeliveringIcon },
  { name: 'Delivered', href: '/home/shipper/delivered', icon: DeliveredIcon },
  { name: 'Cancelled', href: '/home/shipper/cancelled', icon: CancelledIcon },
];
