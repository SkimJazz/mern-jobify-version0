import { FormRow, FormRowSelect, SubmitBtn } from '.';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import { Form, useSubmit, Link } from 'react-router-dom';
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from '../../../utils/constants';
import { useAllJobsContext } from '../pages/AllJobs';



const SearchContainer = () => {
    const { searchValues } = useAllJobsContext();
    const { search, jobStatus, jobType, sortJob } = searchValues;
    // Call useSubmit hook for onChange event handler (Changes URL query params on input change)
    const submit = useSubmit();

    // Debounce function to run onChange event handler after 2000ms
    const debouncedSubmit = (onChange) => {
        let timeout;
        return (e) => {
             const form = e.currentTarget.form;
             clearTimeout(timeout);
             timeout = setTimeout(() => {
                 onChange(form);
             }, 2000);
        };
    };

    return (
        <Wrapper>
            <Form className='form'>
                <h5 className='form-title'> search form </h5>
                <div className='form-center'>
                    <FormRow
                        type='search'
                        name='search'
                        defaultValue={search}
                        onChange={debouncedSubmit((form) => { submit(form) })}
                    />
                    <FormRowSelect
                        labelText='job status'
                        name='jobStatus'
                        list={['all', ...Object.values(JOB_STATUS)]}
                        defaultValue={jobStatus}
                        onChange={(e) => {
                            submit(e.currentTarget.form);
                        }}
                    />
                    <FormRowSelect
                        labelText='job type'
                        name='jobType'
                        list={['all', ...Object.values(JOB_TYPE)]}
                        defaultValue={jobType}
                        onChange={(e) => {
                            submit(e.currentTarget.form);
                        }}
                    />
                    <FormRowSelect
                        labelText='sort by'
                        name='sortJob'
                        defaultValue={sortJob}
                        list={[...Object.values(JOB_SORT_BY)]}
                        onChange={(e) => {
                            submit(e.currentTarget.form);
                        }}
                    />

                    {/* Link back to all-jobs essentially resets the query params (resets the search)
                        so the params do go for a ride when a request is made. As result, we get back
                        all jobs */}
                    <Link to='/dashboard/all-jobs' className='btn form-btn delete-btn'>
                        Reset Search Values
                    </Link>

                    {/* TEMP!!!! */}
                    {/*<SubmitBtn formBtn />*/}
                </div>
            </Form>
        </Wrapper>
    )
}
export default SearchContainer
