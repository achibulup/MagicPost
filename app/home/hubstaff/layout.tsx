import { links } from '@/app/ui/hubstaff/nav-links';
import { getUserProfile } from '@/lib/backend/auth/session';
import { notFound, redirect } from 'next/navigation';
import SideBar from '@/app/ui/common/sidebar';


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getUserProfile();
  if (!session) {
    redirect('/login');
  }
  if (session?.role !== 'staff' || session?.transitHub == null) {
    notFound();
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <SideBar home="/home/hubstaff" links={links} />
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
