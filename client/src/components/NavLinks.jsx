import {useDashboardContext} from "../pages/DashboardLayout.jsx";
import links from "../utils/Links.jsx";
import {NavLink} from "react-router-dom";


const NavLinks = ({isBigSidebar}) => {

    const {toggleSidebar, user} = useDashboardContext();

    return (
        <div className='nav-links'>
            {links.map((link) => {
                const {text, path, icon} = link;
                // Admin.jsx: If the user is not an admin, hide the admin link
                const { role } = user;
                if (role !== 'admin' && path === 'admin') return;

                return (
                    <NavLink
                        to={path}
                        key={text}
                        className='nav-link'
                        onClick={isBigSidebar ? null : toggleSidebar}
                        // will discuss in a second
                        end
                    >
                        <span className='icon'>{icon}</span>
                        {text}
                    </NavLink>
                );
            })}
        </div>
    )
}
export default NavLinks
