// Importing necessary modules and components
import {Link, useRouteError} from "react-router-dom";
import Wrapper from "../assets/wrappers/ErrorPage";
import img from "../assets/images/not-found.svg";


/**
 * Error component to handle and display errors in the application.
 * @returns {JSX.Element} The Error component that displays the error message and a link to navigate back to the dashboard.
 */
const Error = () => {

    // useRouteError use to find out more about the error
    const error = useRouteError();
    console.log(error);

    // Checking if the error status is 404
    if (error.status === 404) {

        // If error status is 404, return following JSX structure:
        // image, heading, paragraph and link to navigate back to dashboard
        return (
            <Wrapper>
                <div>
                    <img src={img} alt='not found' />
                    <h3>Ohh! page not found</h3>
                    <p>We can't seem to find the page you're looking for</p>
                    <Link to='/dashboard'>back home</Link>
                </div>
            </Wrapper>
        );
    }

    // If error status is NOT 404, return JSX structure that
    // includes just the heading
    return (
        <Wrapper>
            <div>
                <h3>something went wrong</h3>
            </div>
        </Wrapper>
    );
};

// Export Error component
export default Error
