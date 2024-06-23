import styled from 'styled-components';

/**
 * `Wrapper` is a styled-component that creates a section with specific styles.
 * It is used as a container for the login and register pages.
 *
 * @component
 * @example
 * // Usage
 * <Wrapper>
 *   <Logo />
 *   <Form />
 * </Wrapper>
 */
const Wrapper = styled.section`

    /* Minimum height to fill the viewport height */
    min-height: 100vh;
    /* Uses CSS Grid for layout */
    display: grid;
    /* Aligns items in center of CSS grid */
    align-items: center;

    /* Styles for logo -> Ref components/Logo.jsx */
    .logo {
        display: block;
        margin: 0 auto;
        margin-bottom: 1.38rem;
    }

    /* form element Ref Login.jsx Register.jsx */
    .form {
        max-width: 400px;
        border-top: 5px solid var(--primary-500);
    }

    /* h4 element Login heading Ref Login.jsx Register.jsx   */
    h4 {
        text-align: center;
        margin-bottom: 1.38rem;
    }

    /* Paragraph element containing link component to Register page */
    p {
        margin-top: 1rem;
        text-align: center;
        line-height: 1.5;
    }

    /* Submit buttons Ref Login.jsx Register.jsx  */
    .btn {
        margin-top: 1rem;
    }

    /* Link to Register page and back links to Login page  */
    .member-btn {
        color: var(--primary-500);
        letter-spacing: var(--letter-spacing);
        margin-left: 0.25rem;
    }
`;
export default Wrapper;
