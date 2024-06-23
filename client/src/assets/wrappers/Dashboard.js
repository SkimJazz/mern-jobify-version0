import styled from 'styled-components';

const Wrapper = styled.section`
    .dashboard {
        
        /* Default(grid) one colum layout */
        display: grid;
        grid-template-columns: 1fr;
    }
    
    /* Outlet child routes */
    .dashboard-page {
        width: 90vw;
        margin: 0 auto;
        padding: 2rem 0;
    }
    
    /* Logic for Big Screen (BigSidebar):
    When expanding to the bigger screen, we want the BigSidebar to be 
    the first colum at a min width of 992 pixels */
    @media (min-width: 992px) {
        .dashboard {
            /* Once we get to 992px then chose auto CSS function */
            grid-template-columns: auto 1fr;
        }
        .dashboard-page {
            /* 90% of the content NOT 90% of the screen width (vw) */
            width: 90%;
        }
`;
export default Wrapper;
