import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';
import { useLoaderData } from 'react-router-dom';


export const loader = async () => {
    try {
        const response = await customFetch.get('/jobs/stats');
        return response.data;
    }   catch (error) {
        return error;
    }

};


const Stats = () => {

    // Access the data passed from the loader function
    const { defaultStats, monthlyApplications } = useLoaderData();
    // Render the StatsContainer component
    return <>
    < StatsContainer defaultStats={defaultStats} />
        {
            monthlyApplications?.length > 0 && ( <ChartsContainer data={monthlyApplications} />
        )}
    </>
};
export default Stats
