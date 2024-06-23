import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';


//1. Loader function fetches jobs data from '/jobs' endpoint
export const loader = async ({ request }) => {

    const params = Object.fromEntries([
        ...new URL(request.url).searchParams.entries(),
    ]);
    // console.log(params)

    try {
        // Fetch jobs data from '/jobs' endpoint
        const { data } = await customFetch.get('/jobs', { params });
        // Return data object to be used in AllJobs component
        return { data, searchValues: {...params } };    //=> useLoaderData to access data in component.
    }   catch (error) {
        toast.error(error?.response?.data?.msg);
        return error;
    }
};

//
const AllJobsContext = createContext();

//2. AllJobs component renders SearchContainer and JobsContainer components
const AllJobs = () => {

    //useLoaderData hook to access data object returned by loader function
    const { data, searchValues } = useLoaderData();
    // console.log(data)
    //Render SearchContainer and JobsContainer components
    return (
        <AllJobsContext.Provider value={{ data, searchValues }}>
            <SearchContainer />
            <JobsContainer />
        </AllJobsContext.Provider>
    )
}
// Custom useAllJobsContext hook exported to JobsContainer.jsx
export const useAllJobsContext = () => useContext(AllJobsContext);
export default AllJobs
