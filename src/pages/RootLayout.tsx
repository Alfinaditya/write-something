import { Outlet } from 'react-router-dom';
import Sidebar from './partials/Sidebar';
import MobileNavbar from './partials/MobileNavbar';

import { twMerge } from 'tailwind-merge';

const RootLayout = () => {
  return (
    <div
      className={twMerge('bg-gray-50', 'h-max min-h-screen', 'sm:pb-10 pb-32')}
    >
      <Sidebar />
      <MobileNavbar />
      <Outlet />
    </div>
  );
};

export default RootLayout;
