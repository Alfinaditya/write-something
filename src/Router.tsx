import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './pages/RootLayout';
import Homepage from './pages/home/Homepage';
import NoteDetailsPage from './pages/note-details/NoteDetailsPage';
import DeletePage from './pages/delete/DeletePage';

const Router = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { path: '/', element: <Homepage />, index: true },
        {
          path: '/note/:id',
          element: <NoteDetailsPage />,
        },
        {
          path: '/delete',
          element: <DeletePage />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
