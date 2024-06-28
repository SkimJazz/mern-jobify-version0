// Libraries
import { redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
// Utils
import customFetch from '../utils/customFetch';



export const action = (queryClient) => async ({ params }) => {
    try {
        await customFetch.delete(`/jobs/${params.id}`);
        queryClient.invalidateQueries(['jobs']);

        toast.success('Job deleted successfully', { autoClose: 1500 });
    } catch (error) {
        toast.error(error.response.data.msg);
    }
    return redirect('/dashboard/all-jobs');
}