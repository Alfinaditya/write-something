import { Link, NavLink, useLocation } from 'react-router-dom';
import { EditIcon, HamburgerIcon, TrashIcon, XIcon } from '../../icons';
import { twMerge } from 'tailwind-merge';
import Brand from '../../assets/brand.svg';
import { useEffect, useRef, useState } from 'react';
import useOnClickOutside from '../../hooks/useOnClickOutside';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);
  useOnClickOutside(sidebarRef, () => setIsOpen(false));

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const activeStyles = 'fill-main text-main font-bold';
  const baseStyles = 'fill-gray-600';

  const navLinks = [
    {
      link: '/',
      label: 'Home',
      activeStyle: activeStyles,
      icon: <EditIcon />,
    },
    {
      link: '/delete',
      label: 'Delete',
      activeStyle: activeStyles,
      icon: <TrashIcon />,
    },
  ];
  return (
    <div>
      <nav
        className={twMerge(
          'sm:flex sm:items-center',
          'border-b',
          'mb-10 p-5',
          'hidden'
        )}
      >
        <div onClick={toggleSidebar} className="cursor-pointer">
          {isOpen ? <XIcon /> : <HamburgerIcon />}
        </div>
        <Link to="/" className={twMerge('flex items-center', 'ml-8')}>
          <img src={Brand} alt="" />
          <h1
            className={twMerge(
              'w-28',
              'ml-3.5',
              'font-bold text-xl text-slate-950'
            )}
          >
            Write Something.
          </h1>
        </Link>
      </nav>

      <div
        ref={sidebarRef}
        className={twMerge(
          'bg-white',
          'z-10',
          'border-r',
          'text-black',
          'h-screen w-64',
          'fixed top-0 left-0',
          'overflow-y-auto',
          'transition-transform transform',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <ul className="py-4">
          <div className={twMerge('mb-8', 'flex items-center')}>
            <Link to="/" className={twMerge('flex items-center', 'ml-2')}>
              <img src={Brand} className="w-6" />
              <h1
                className={twMerge(
                  'w-28',
                  'ml-3.5',
                  'font-bold text-sm text-slate-950'
                )}
              >
                Write Something.
              </h1>
            </Link>
            <XIcon
              onClick={toggleSidebar}
              className={twMerge('cursor-pointer', 'ml-auto mr-5')}
            />
          </div>
          {navLinks.map((navLink) => (
            <li
              key={crypto.randomUUID()}
              className={twMerge(
                'hover:border-l-4 hover:bg-gray-50 hover:font-bold',
                'text-gray-600 border-main'
              )}
            >
              <NavLink
                to={navLink.link}
                className={({ isActive }) =>
                  twMerge(
                    isActive ? activeStyles : baseStyles,
                    'flex items-center',
                    'px-2 py-6'
                  )
                }
              >
                {navLink.icon}
                <p className="ml-4">{navLink.label}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
