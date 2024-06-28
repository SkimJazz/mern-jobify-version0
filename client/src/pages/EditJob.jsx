// Library imports
import { Form, useLoaderData, redirect } from 'react-router-dom';
// import { useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';


// Local imports - Client side
import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import customFetch from '../utils/customFetch';
import { useQuery } from '@tanstack/react-query';

// Local imports - Server side
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';



const singleJobQuery = (id) => {
    return {
        queryKey: ['job', id],
        queryFn: async () => {
            const { data } = await customFetch.get(`/jobs/${id}`);
            return data;
        },
    };
};




//1. Data Loader: Loads job data in preparation for editing
export const loader = (queryClient) => async ({ params }) => {

    try {
        /**
         * BACK TICK TEMPLATE LITERAL
         *
         * In the 'customFetch.get()' method, the first argument is a string
         * that represents the URL to send the GET request to. The URL is
         * constructed using a back tick template literal. The template
         * literal is used to construct the URL dynamically by inserting
         * the value of the 'params.id' property into the URL string. Thus,
         * the URL will be different for each job based on the value of the
         * 'params.id' property. Essentially, the template literal allows
         * for the dynamic construction of the URL string.
         *
         *
         * @async
         * @function
         * @param {Object} params - An object containing the parameters for the request.
         * @param {string} params.id - The unique ID of the job to retrieve.
         *
         * @returns {Promise<Object>} The data about the job.
         *
         * @example
         * // Suppose params.id is '1234'
         * const { data } = await customFetch.get(`/jobs/${params.id}`);
         * // The template literal `/jobs/${params.id}` will evaluate to '/jobs/1234'
         */
        // const { data } = await customFetch.get(`/jobs/${params.id}`);
        await queryClient.ensureQueryData(singleJobQuery(params));
        return params.id;
    }   catch (error) {
        // return error using toast.error() method
        toast.error(error?.response?.data?.msg, {autoClose: 1500});
        // return a redirect to dashboard/all-jobs page
        return redirect('/dashboard/all-jobs');
    }
};


//2. EditJob Component render a form to edit job details
const EditJob = () => {

    const id = useLoaderData();

    // useLoaderData() hook called to get job data (in this case the jobs ID)
    const { data: { job } } = useQuery(singleJobQuery(id));

    // Render form to edit job details
    return (
        <Wrapper>
            <Form method="post" className='form'>
                <h4 className='form-title'> Edit Job </h4>
                <div className='form-center'>
                    <FormRow
                        type='text'
                        name='position'
                        defaultValue={job.position}
                    />
                    <FormRow
                        type='text'
                        name='company'
                        defaultValue={job.company}
                    />
                    <FormRow
                        type='text'
                        labelText='job location'
                        name='jobLocation'
                        defaultValue={job.jobLocation}
                    />
                    <FormRowSelect
                        name='jobStatus'
                        labelText='job status'
                        defaultValue={job.jobStatus}
                        list={Object.values(JOB_STATUS)}
                    />
                    <FormRowSelect
                        name='jobType'
                        labelText='job type'
                        defaultValue={job.jobType}
                        list={Object.values(JOB_TYPE)}
                    />
                    <SubmitBtn formBtn />

                </div>
            </Form>
        </Wrapper>
    );
};
export default EditJob


//3. EditJobAction: Ref App.jsx for EditJob route configuration
export const action = (queryClient) => async ({ request, params }) => {
    // Get the formData from the request in the database
    const formData = await request.formData();
    // Convert formData to an object (Why? Because we want to send the data as an object)
    const data = Object.fromEntries(formData);
    // Try catch block to update the job with this mongoDB '_id' in the database
    try {
        // Await customFetch.put() method to update job with mongoDB '_id' -> Use template literal as we want to pass in the 'id'
        await customFetch.patch(`/jobs/${params.id}`, data);
        queryClient.invalidateQueries(['jobs']);
        // Include toast.success() method to show success message
        toast.success('Job updated successfully', {autoClose: 1500});
        // return a redirect to dashboard/all-jobs page if all is correct
        return redirect('/dashboard/all-jobs');
    }   catch (error) {
        // return error using toast.error() method
        toast.error(error?.response?.data?.msg, {autoClose: 1500});
        return error;
    }
};
