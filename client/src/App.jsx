import {createBrowserRouter, RouterProvider} from "react-router-dom";
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



export const checkDefaultTheme = () => {
  const isDarkTheme =
      localStorage.getItem('darkTheme') === 'true'
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};
checkDefaultTheme();




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
        action: loginAction,
      },
      {
        // Child element-3 Dash Board
        path:'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,

        // Pages rendered inside Dashboard page
        children: [
          {
            // url /dashboard will go to this AddJob page as this is
            // the index page for DashBoardLayout child routes.
            index: true,
            element: <AddJob />,
            action: addJobAction,
          },

          {
            path: 'stats',
            element: <Stats />,
            loader: statsLoader,
          },

          {
            path: 'all-jobs',
            element: <AllJobs />,
            loader: allJobsLoader,
          },

          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
          },

          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: 'edit-job/:id',
            element: <EditJob />,
            loader: editJobLoader,
            action: editJobAction,
          },
          {
            path: 'delete-job/:id',
            action: deleteJobAction,
          },
        ]
      },

    ]
  },

]);


const App = () => {
  return <RouterProvider router={router} />;
};
 
export default App;