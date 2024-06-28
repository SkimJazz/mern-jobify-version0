// Libraries imports
import { useOutletContext, Form, redirect  } from 'react-router-dom';
// import { useNavigation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Local imports - Server side
import { JOB_STATUS, JOB_TYPE } from '../../../utils/constants';

// Local imports - Client side
import { FormRow, FormRowSelect, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/DashboardFormPage';



/**
 * @description This is an asynchronous function that handles the action
 * of adding a job. It takes a request object as a parameter, extracts the
 * form data from it, and sends a POST request to the '/jobs' endpoint.
 * The '/jobs' endpoint is where the job data is stored in the backend.
 * The .formData() method is used to extract the form data from the request object.
 * The Object.fromEntries(formData) is used to convert the form data into an object.
 * If the request is successful, it displays a success message and redirects
 * to the 'all-jobs' page. If the request fails, it displays an error message.
 *
 * @function
 * @async
 * @param {Object} request - The request object from which the form data is extracted.
 * @returns {Promise} - A promise that resolves to a redirection to the 'all-jobs' page if the request is successful, or an error if the request fails.
 *
 * @link {customFetch.js} - The customFetch.post() method is imported from customFetch.js.
 * @link {react-router-dom} - The redirect() function is imported from react-router-dom.
 * @link {react-toastify} - The toast.success() and toast.error() functions are imported from react-toastify.
 *
 * @example
 * action({ request: { formData: () => ({ position: 'Developer', company: 'Company' }) } });
 */
export const action = (queryClient) => async ({ request }) => {
    // Access form data using .formData() method
    const formData = await request.formData();
    // Turn the form data into an object using Object.fromEntries() method
    const data = Object.fromEntries(formData);
    // Try to add a job using the customFetch.post() method
    try {
        await customFetch.post('/jobs', data);
        // Invalidate queries in the jobs array
        queryClient.invalidateQueries(['jobs']);
        toast.success('Job added successfully', { autoClose: 1500 });
        return redirect('all-jobs');
    } catch (error) {
        toast.error(error?.response?.data?.msg);
        return error;
    }
};



const AddJob = () => {
    // RRD hook -> accesses <Outlet context={{user}}/> in DashboardLayout.jsx
    const { user } = useOutletContext();
    // RRD hook -> accesses navigation state
    // const navigation = useNavigation();
    // Check if form is submitting, if true, disable submit button while submitting
    // const isSubmitting = navigation.state === 'submitting';

    return (
        <Wrapper>
            <Form method='post' className='form'>
                <h4 className='form-title'>add job</h4>
                <div className='form-center'>

                    {/*
                    * @description FormRow functional component that renders a text input field.
                    *
                    * @component
                    * @param {Object} props - Properties passed to the component.
                    * @param {string} props.type - Type of the input field (e.g., 'text').
                    * @param {string} props.name - Name and id of the input field.
                    * @param {string} props.labelText - Text for the label of the input field.
                    * @param {string} [props.defaultValue=''] - Initial value that the input field should display.
                    *
                    * @link {FormRow.jsx} - This component is imported from FormRow.jsx.
                    *
                    * @example
                    * <FormRow
                    *    type='text'
                    *    name='username'
                    *    labelText='Username'
                    *    defaultValue='testUser'
                    * />
                    */}
                    <FormRow type='text' name='position' />
                    <FormRow type='text' name='company' />
                    <FormRow
                        type='text'
                        labelText='job location'
                        name='jobLocation'
                        defaultValue={user.location} // Use Users location as default value
                    />

                    {/*
                    * Functional component in React that represents a row in a form.
                    * It consists of a label and a select dropdown. The label and select dropdown are
                    * created based on the props passed to the component.
                    *
                    * This FormRowSelect component is also used in Register.jsx
                    *
                    * @component
                    * @prop {string} labelText - label text for the select dropdown.
                    * @prop {string} name - name of the select dropdown.
                    * @prop {string} defaultValue - (OPTIONAL) initial value that the select dropdown should display.
                    * @prop {Array} list - array of values that the select dropdown should display as options.
                    *
                    * @link {FormRowSelect.jsx} - This component is imported from FormRowSelect.jsx.
                    */}
                    <FormRowSelect
                        labelText='job status'
                        name='jobStatus'
                        defaultValue={JOB_STATUS.PENDING}
                        list={Object.values(JOB_STATUS)}
                    />
                    <FormRowSelect
                        labelText='job type'
                        name='jobType'
                        defaultValue={JOB_TYPE.FULL_TIME}
                        list={Object.values(JOB_TYPE)}
                    />

                    {/* formBtn by default is true */}
                    <SubmitBtn formBtn />


                </div>
            </Form>
        </Wrapper>
    );
};
export default AddJob
