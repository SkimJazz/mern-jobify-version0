import Wrapper from "../assets/wrappers/BigSidebar.js";
import NavLinks from './NavLinks.jsx';
import Logo from '../components/Logo';
import { useDashboardContext } from '../pages/DashboardLayout';



const BigSidebar = () => {

    const {showSidebar} = useDashboardContext();

    return (
        <Wrapper>
            <div className={
                showSidebar ? 'sidebar-container' : 'sidebar-container show-sidebar'
            }
            >
                <div className="content"></div>
                <header>
                    <Logo/>
                </header>
                <NavLinks isBigSidebar />
            </div>
        </Wrapper>
    )
}
export default BigSidebar
