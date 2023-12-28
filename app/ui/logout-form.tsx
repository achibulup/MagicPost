// import React from 'react';
'use client'
import { PowerIcon } from '@heroicons/react/24/outline';

const LogoutForm = () => {
  const handleLogout = async (event: { preventDefault: () => void; }) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      // Perform the logout using the Fetch API
      const response = await fetch("http://localhost:3001/api/logout");

      if (response.ok) {
        // Handle successful logout (redirect, update state, etc.)
        console.log('Logout successful');
      } else {
        // Handle logout failure
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <form
      onSubmit={async () => {
        await fetch("localhost:3000/api/logout");
      }}
    >
      <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
        <PowerIcon className="w-6" />
        <div className="hidden md:block">Sign Out</div>
      </button>
    </form>
  );
};

export default LogoutForm;
