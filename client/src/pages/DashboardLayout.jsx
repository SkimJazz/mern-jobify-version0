/**
 * DashboardLayout.jsx
 *
 * This file exports the `DashboardLayout` component, a functional component in React.
 *
 * @module DashboardLayout
 * @see {@link https://reactrouter.com/docs/en/v6/api#outlet|React Router - Outlet}
 *
 * @example
 * // Importing the component
 * import DashboardLayout from './DashboardLayout';
 *
 * // Using the component
 * <DashboardLayout />
 */
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { Navbar, BigSidebar, SmallSidebar } from "../components";
import Wrapper from "../assets/wrappers/Dashboard.js";
import { useState, createContext, useContext } from 'react'; // React router has built-in 'prop' that works as a 'context'
import { checkDefaultTheme} from "../App.jsx";
import customFetch from "../utils/customFetch.js";
import { toast } from "react-toastify";


// Loader will get the data even before the component is rendered
// (Loader requires something to be returned)
export const loader = async () => {
    try {
        const { data } = await customFetch.get('/users/current-user');
        return data;
    }   catch (error) {
        return redirect('/'); // Redirect to landing page
    }
    // return 'Dashboard data loaded successfully'; // console test for getting and loading user data
}

/**
 * `DashboardLayout` component uses the `Outlet` component from `react-router-dom`.
 *
 * The `Outlet` component is a placeholder component that renders the child routes.
 * In the context of this application, the `DashboardLayout` component is a parent route
 * that has multiple child routes. These child routes are rendered where the `Outlet`
 * component is placed in the JSX returned by the `DashboardLayout` component.
 *
 * The hierarchy of the child routes and their corresponding components is defined in the
 * routing configuration in the `App.jsx` file.
 *
 * @function DashboardLayout
 * @returns {JSX.Element} A `div` element wrapping the `Outlet` component.
 */

// Global Context for SmallSidebar, BigSidebar, Navbar
const DashboardContext = createContext();
//DashboardLayout component -> Parent for all the following components
const DashboardLayout = ({ isDarkThemeEnabled }) => {

    const { user } = useLoaderData();       // RRD hook passed as a prop and used to get user data
    const navigate = useNavigate();     // RRD hook passed as a prop
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled ?? checkDefaultTheme());


    // Dark theme toggle
    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme;
        setIsDarkTheme(newDarkTheme);
        // Vanilla JS -> used to target 'body' element and toggle the 'dark-theme' class
        document.body.classList.toggle('dark-theme', newDarkTheme);
        /**
         * Light theme is active by default, so the DarkTheme must presxists
         * when user refreshes the page or navigates to another page, therefore
         * we use 'localStorage' to store the value of 'darkTheme' and set it to
         * 'newDarkTheme' value.
         * We still need to access 'newDarkTheme' for the local storage, BUT because
         * of the structure of this application, we can't access 'newDarkTheme' directly
         * from the 'DashboardLayout', so we need to store 'newDarkTheme'
         * in a variable called 'darkTheme' and pass 'darkTheme' as the second argument
         * to 'localStorage.setItem' method.
         *
         * */
        localStorage.setItem('darkTheme', newDarkTheme);
        // console.log('toggle dark theme');
    };


    // Sidebar toggle
    const toggleSidebar = () => {
        // setShowSidebar is equal to opposite(!) value of current showSidebar Ruh?
        setShowSidebar(!showSidebar);
        console.log('toggle sidebar')
    };


    // User LOGOUT
    const logoutUser = async () => {
        navigate('/');                                  // Redirect to landing page
        await customFetch.get('/auth/logout');      // Request to logout route that clears out the cookie
        toast.success('Logging out...', { autoClose: 1500 });
    };


    return (

        // Context variables and functions provided to child components
        <DashboardContext.Provider
            value={{
                user,
                showSidebar,
                isDarkTheme,
                toggleDarkTheme,
                toggleSidebar,
                logoutUser,
            }}
        >

            <Wrapper>
                <main className='dashboard'>

                    {/* Child components of DashboardLayout
                    Sidebars and Navbar components can be passed down
                    as props, however these components have been set up as
                    Global Context */}
                    <SmallSidebar />
                    <BigSidebar />
                    <div>
                        <Navbar />
                        <div className='dashboard-page'>
                            <Outlet context={{ user }}/>
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    )
}

// useDashboardContext hook exported to Navbar.jsx, SmallSidebar.jsx, BigSidebar.jsx
export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout
