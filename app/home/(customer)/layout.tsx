import { links } from '@/app/ui/customer/nav-links';
import { getUserProfile } from '@/lib/backend/auth/session';
import { notFound, redirect } from 'next/navigation';
import SideBar from '@/app/ui/common/sidebar';


export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await getUserProfile();
  if (!session) {
    redirect('/login');
  }
  if (session.role !== 'customer') {
    console.log(session);
    if (session.role === 'staff' || session.role === 'manager') {
      if (session.pickupPoint == null) {
        redirect('/home/hubstaff');
      } else {
        redirect('/home/pickupstaff');
      }
    }
    if (session.role === 'shipper') {
      redirect('/home/shipper');
    }
    if (session.role === 'director') {
      redirect('/home/director');
    }
  }
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <SideBar links={links} />
      <div className="grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}
