'use client'

import {
  TransportingIcon,
  DeliveringIcon,
  DeliveredIcon,
  CancelledIcon,
} from '@/app/ui/common/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export const links = [
  { name: 'Transporting', href: '/home/transporting', icon: TransportingIcon },
  { name: 'Delivering', href: '/home/delivering', icon: DeliveredIcon },
  { name: 'Delivered', href: '/home/delivered', icon: DeliveredIcon },
  { name: 'Canceled', href: '/home/canceled', icon: CancelledIcon },
];
