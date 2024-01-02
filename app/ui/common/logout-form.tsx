// import React from 'react';
'use client'
import { PowerIcon } from '@heroicons/react/24/outline';
import { logout } from '@/lib/frontend/actions/auth';
import { useRouter } from 'next/navigation';

const LogoutForm = () => {
  const router = useRouter();
  const handleLogout = async (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      // Perform the logout using the Fetch API
      const result = await logout();
      if (Math.floor(result.status / 100) === 2) {
        router.refresh();
      } else {
        // Handle logout failure
        alert('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <form
      onSubmit={handleLogout}
    >
      <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Sign Out</div>
      </button>
    </form>
  );
};

export default LogoutForm;
