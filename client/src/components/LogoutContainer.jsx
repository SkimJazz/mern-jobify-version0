import Wrapper from '../assets/wrappers/LogoutContainer';


// This useState is used to set the state of the showLogout variable to false.
// The variables are the following: showLogout, setShowLogout, user, and logoutUser.
import { useState } from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';
import {FaUserCircle, FaCaretDown} from "react-icons/fa";

// LogoutContainer component -> Child component of Navbar in DashboardLayout.jsx
// and therefore indirectly a child of DashboardLayout
const LogoutContainer = () => {

    // Local state value for the showLogout button (Weather to show the logout button or not)
    const [showLogout, setShowLogout] = useState(false);

    // Destructuring the user and logoutUser from the useDashboardContext
    const {user, logoutUser} = useDashboardContext();

    return (
        <Wrapper>
            <button
                type='button'
                className='btn logout-btn'
                onClick={() => setShowLogout(!showLogout)}
            >
                {user.avatar ? (
                    <img src={user.avatar} alt='avatar' className='img'/>
                ) : (
                    <FaUserCircle/>
                )}

                {user?.name}
                <FaCaretDown/>
            </button>
            <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
                <button
                    type='button'
                    className='btn logout-btn'
                    onClick={logoutUser}
                >
                    logout
                </button>
            </div>
        </Wrapper>
    )
}
export default LogoutContainer
