import { HiChevronDoubleLeft, HiChevronDoubleRight } from 'react-icons/hi';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import Wrapper from '../assets/wrappers/PageBtnContainer';
import { useAllJobsContext } from '../pages/AllJobs';



const PageBtnContainer = () => {

    const { data: { numOfPages, currentPage } } = useAllJobsContext();
    const { search, pathname } = useLocation();
    const navigate = useNavigate();
    const pages = Array.from({ length: numOfPages }, (_, index) => {
        return index + 1;
    });
    // console.log(search, pathname, numOfPages, currentPage, pages)

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        // console.log(pageNumber)
        const searchParams = new URLSearchParams(search);
        searchParams.set('page', pageNumber);
        navigate(`${pathname}?${searchParams.toString()}`);
    };

    return (
        <Wrapper>

            <button className='btn prev-btn'
                onClick={() => {
                    let prevPage = currentPage - 1;
                    if (prevPage < 1) prevPage = numOfPages;
                    handlePageChange(prevPage);
                }}
            >
                <HiChevronDoubleLeft/>
                prev
            </button>

            <div className='btn-container'>
                {pages.map((pageNumber) => {
                    return (
                        <button className={`btn page-btn ${pageNumber === currentPage && 'active'}`}
                                key={pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                        >
                                {pageNumber}
                        </button>
                    );
                })}
            </div>

            <button className='btn next-btn'
                onClick={() => {
                    let nextPage = currentPage + 1;
                    if (nextPage > numOfPages) nextPage = 1;
                    handlePageChange(nextPage);
                }}
            >
                <HiChevronDoubleRight/>
                next
            </button>

        </Wrapper>
    )
}
export default PageBtnContainer
