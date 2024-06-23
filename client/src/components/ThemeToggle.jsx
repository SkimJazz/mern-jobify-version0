import Wrapper from "../assets/wrappers/ThemeToggle.js";
import {useDashboardContext} from "../pages/DashboardLayout.jsx";
import {BsFillMoonFill, BsFillSunFill} from "react-icons/bs";


const ThemeToggle = () => {

    const { isDarkTheme, toggleDarkTheme } = useDashboardContext();

    return (
        <Wrapper onClick={toggleDarkTheme}>
            {/*check if dark theme is enabled*/}
            {isDarkTheme ? (
                <BsFillSunFill className='toggle-icon' />
                ) : (
                    <BsFillMoonFill className='toggle-icon' />
                )}
        </Wrapper>
    )
}
export default ThemeToggle
