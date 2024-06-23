/**
 * Logo Component for: Register.jsx
 *
 * Functional component in React that represents the logo of the application.
 * It consists of an image element that displays the logo.
 *
 * The logo image is imported from the `../assets/images/logo.svg` file.
 *
 * @component
 *
 * @example
 * <Logo />
 *
 * @returns A JSX element representing the logo of the application.
 */
import logo from '../assets/images/logo.svg';

// Create the component
const Logo = () => {
    return <img src={logo} alt='jobify' className='logo' />;
};
export default Logo;
