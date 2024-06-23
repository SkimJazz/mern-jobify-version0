import {Outlet} from "react-router-dom";

const HomeLayout = () => {
    return (
        // <div>
        //
        //     {/* add Navbar here  */}
        //     <nav>Navbar</nav>
        //
        //     {/* Outlet:
        //         The content in the child pages(App.jsx) will be displayed
        //         in this <Outlet /> component.
        //     */}
        //     <Outlet />
        // </div>

        // React Fragment <> </>
        <>
            <Outlet />
        </>
    );
};
export default HomeLayout
