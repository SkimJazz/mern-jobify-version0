import { toast } from 'react-toastify';
import { JobsContainer, SearchContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';
import { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
const AllJobsContext = createContext();


// Setup as a function for access to 'params' object => Request dependents on those params (Not hard coded)
// A function that creates an object with a 'queryKey' and 'queryFn' properties
const allJobsQuery = (params) => {
    const { search, jobStatus, jobType, sort, page } = params;
    return {
        queryKey: [
            'jobs',
            search ?? '',
            jobStatus ?? 'all',
            jobType ?? 'all',
            sort ?? 'newest',
            page ?? 1,
        ],
        queryFn: async () => {
            const { data } = await customFetch.get('/jobs', {
                params
            });
            return data;
        },
    };

};


//1. Loader function fetches jobs data from '/jobs' endpoint
export const loader = (queryClient) => async ({ request }) => {
    const params = Object.fromEntries([
        ...new URL(request.url).searchParams.entries(),
    ]);

    await queryClient.ensureQueryData(allJobsQuery(params));
        // Only return searchValues from loader function
        return { searchValues: {...params } };    //=> useLoaderData to access data in component.
};

//
// const AllJobsContext = createContext();

//2. AllJobs component renders SearchContainer and JobsContainer components
const AllJobs = () => {

    //useLoaderData hook to access data object returned by loader function
    const { searchValues } = useLoaderData();
    const { data } = useQuery(allJobsQuery(searchValues));
    // console.log(data)

    return (
        <AllJobsContext.Provider value={{ data, searchValues }}>
            <SearchContainer />
            <JobsContainer />
        </AllJobsContext.Provider>
    );
};
export default AllJobs
// Custom useAllJobsContext hook exported to JobsContainer.jsx
export const useAllJobsContext = () => useContext(AllJobsContext);
// export default AllJobs
