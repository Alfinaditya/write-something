import { Link, NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { EditIcon, TrashIcon } from '../../icons';
import Brand from '../../assets/brand.svg';

export const mobileNavLinks = [
  {
    text: 'Home',
    path: '/',
    unvisitedIcon: <EditIcon />,
    visitedIcon: <EditIcon className="fill-main" />,
  },
  {
    text: 'Delete',
    path: '/delete',
    unvisitedIcon: <TrashIcon />,
    visitedIcon: <TrashIcon className="fill-main" />,
  },
];
const MobileNavbar = () => {
  return (
    <>
      <nav
        className={twMerge(
          'sm:hidden',
          'items-center flex justify-center',
          'border-b',
          'mb-10 p-5'
        )}
      >
        <div className="cursor-pointer"></div>
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
        className={twMerge(
          'sm:hidden',
          'fixed bottom-0 left-0 z-50',
          'w-full h-16',
          'bg-white',
          'border-t'
        )}
      >
        <div
          className={twMerge(
            'flex mx-auto',
            'h-full max-w-lg',
            'justify-evenly',
            'font-medium'
          )}
        >
          {mobileNavLinks.map((nav) => (
            <NavLink
              key={crypto.randomUUID()}
              to={nav.path}
              className="fill-gray-600 w-full"
            >
              {({ isActive }) => (
                <div
                  className={twMerge(
                    'flex flex-col items-center justify-between',
                    'pt-2',
                    isActive ? 'bg-gray-50' : '',
                    'active:bg-gray-50'
                  )}
                >
                  {isActive ? nav.visitedIcon : nav.unvisitedIcon}
                  <span
                    className={twMerge(
                      'text-sm',
                      'mt-2',
                      'text-gray-600',
                      isActive ? 'text-main' : ''
                    )}
                  >
                    {nav.text}
                  </span>
                </div>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
