import Link from 'next/link';
import LogoutForm from '@/app/ui/common/logout-form';
import MagicPostLogo from '@/app/ui/common/mgpt-logo';
import type { LinkProps } from './nav-links';
import { NavLinks } from './nav-links';

export default function SideNav({ home, links }: { home?: string, links: LinkProps[]}) {
  return (
    <div className="w-full flex-none md:w-64">
      <div className="flex h-full flex-col px-3 py-4 md:px-2">
        <Link
          className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
          href={home == null ? "/home" : home}
        >
          <div className="w-32 text-white md:w-40">
            <MagicPostLogo />
          </div>
        </Link>
        <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks links={links} />
          <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
          <LogoutForm />
        </div>
      </div>
    </div>
  );
}
