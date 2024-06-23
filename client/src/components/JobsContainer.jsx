/**
 * @file This file defines the JobsContainer component which is responsible for displaying a list of jobs.
 * @see {@link Job} for the child component used to display individual jobs.
 * @see {@link useAllJobsContext} for the custom hook used to fetch the jobs data.
 * @module JobsContainer
 */
import Job from './Job'
import Wrapper from "../assets/wrappers/JobsContainer";
import { useAllJobsContext } from '../pages/AllJobs';
import PageBtnContainer from './PageBtnContainer';


/**
 * The JobsContainer component fetches an array of jobs using the useAllJobsContext
 * hook and displays a list of jobs. If there are no jobs to display, it renders a
 * message indicating this. Otherwise, it maps over the jobs array and renders a Job
 * component for each job. Each Job component is given a unique key prop and is
 * passed all properties of the job object as props.
 *
 * @function
 * @returns {JSX.Element} A Wrapper component containing either a message indicating
 *                        that there are no jobs to display, or a list of Job components.
 */
const JobsContainer = () => {

    /**
     * @type {Object} data - Data object returned by useAllJobsContext hook.
     * @property {Array} jobs - Array of jobs to display.
     */
    const { data } = useAllJobsContext();
    const { jobs, totalJobs, numOfPages } = data;
    if (jobs.length === 0) {

        return (
            <Wrapper>
                <h2>No jobs to display...</h2>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <h5>
                {totalJobs} job{jobs.length > 1 && 's'} found
            </h5>
            <div className='jobs'>
                {jobs.map((job) => {
                    // Import from Job.jsx and pass job object as props
                    return <Job key={job._id} {...job} />;
                })}
            </div>
            {numOfPages > 1 && <PageBtnContainer />}
        </Wrapper>
    );
};
export default JobsContainer
