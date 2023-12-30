import Link from 'next/link';
import { links } from '@/app/ui/customer/nav-links';
import { NavLinks } from '@/app/ui/common/nav-links';
import LogoutForm from '@/app/ui/common/logout-form';
import MagicPostLogo from '@/app/ui/common/mgpt-logo';
import { getUserProfile } from '@/lib/backend/auth/session';
import { notFound, redirect } from 'next/navigation';


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getUserProfile();
  if (!session) {
    redirect('/login');
  }
  if (session?.role !== 'customer') {
    notFound();
  }
  console.log(NavLinks);
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
          <Link
            className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
            href="/home"
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
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
