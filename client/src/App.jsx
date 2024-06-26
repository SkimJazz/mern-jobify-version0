// Library Imports
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Local Imports
import {
    HomeLayout,
    Landing,
    Register,
    Login,
    DashboardLayout,
    Error,
    AddJob,
    Stats,
    AllJobs,
    Profile,
    Admin,
    EditJob,

} from  './pages'

// Import 'action' from Register.js, but rename as 'registerAction' for 'Register' component
// in the 'router' object below.
import {action as registerAction} from './pages/Register';
import {action as loginAction} from './pages/Login';
import {loader as dashboardLoader} from './pages/DashboardLayout';
import {action as addJobAction } from './pages/AddJob';
import {loader as allJobsLoader} from './pages/AllJobs';
import {loader as editJobLoader} from './pages/EditJob';
import {action as editJobAction} from './pages/EditJob';
import {action as deleteJobAction} from './pages/DeleteJob';
import {loader as adminLoader} from './pages/Admin';
import {action as profileAction} from './pages/Profile';
import {loader as statsLoader} from './pages/Stats';
import ErrorElement from "./components/ErrorElement.jsx";



export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};
const isDarkThemeEnabled = checkDefaultTheme();


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});


const router = createBrowserRouter([
  {
    // Home Page => Parent Route
    path:'/',
    element:<HomeLayout />,

    // Error prop
    errorElement:<Error />,

    // Children using relative path
    children: [
      {
        index: true,
        element:<Landing />,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
      },

      {
        // Child element-2 Login
        path:'login',
        element: <Login />,
        action: loginAction(queryClient),
      },
      {
        // Child element-3 Dash Board
        path:'dashboard',
        element: <DashboardLayout
            isDarkThemeEnabled={isDarkThemeEnabled}
            queryClient={queryClient} />,
        loader: dashboardLoader(queryClient),

        // Pages rendered inside Dashboard page
        children: [
          {
            // url /dashboard will go to this AddJob page as this is
            // the index page for DashBoardLayout child routes.
            index: true,
            element: <AddJob />,
            action: addJobAction(queryClient),
          },

          {
            path: 'stats',
            element: <Stats />,
            loader: statsLoader(queryClient),
            errorElement: <ErrorElement />,
          },

          {
            path: 'all-jobs',
            element: <AllJobs />,
            loader: allJobsLoader(queryClient),
            errorElement: <ErrorElement />,
          },

          {
            path: 'profile',
            element: <Profile />,
            action: profileAction(queryClient),
          },

          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: 'edit-job/:id',
            element: <EditJob />,
            loader: editJobLoader(queryClient),
            action: editJobAction(queryClient),
          },
          {
            path: 'delete-job/:id',
            action: deleteJobAction(queryClient),
          },
        ]
      },

    ]
  },

]);


const App = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  );
};
export default App;