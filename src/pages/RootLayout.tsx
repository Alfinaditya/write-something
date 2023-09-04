import { NavLink, Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div>
      {/* <img src={brand} alt="" /> */}
      <NavLink to="/">Home</NavLink>
      <NavLink to="/delete">Delete</NavLink>
      <Outlet />
    </div>
  );
};

export default RootLayout;
