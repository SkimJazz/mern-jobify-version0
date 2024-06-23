// // Library imports
import { useOutletContext, Form  } from 'react-router-dom';
// import {useNavigation} from 'react-router-dom';
import { toast } from 'react-toastify';

// Local imports Client side
import { FormRow, SubmitBtn } from '../components';
import Wrapper from '../assets/wrappers/DashboardFormPage';
import customFetch from '../utils/customFetch';




// -------------------------- CLIENT SIDE --------------------------- //
const Profile = () => {

    const { user } = useOutletContext();
    const { name, lastName, email, location } = user;

    /**
     * @description This is a file input field used for uploading an image file.
     * The image file will be sent to the server as formData and not JSON.
     *
     * @component
     * @example
     * <div className='form-row'>
     *   <label htmlFor='avatar' className='form-label'>
     *     Select an image file (max 0.5 MB):
     *   </label>
     *   <input
     *     type='file'
     *     id='avatar'
     *     name='avatar'
     *     className='form-input'
     *     accept='image/*'
     *   />
     * </div>
     *
     * @property {string} type - Specifies that the input field should be a file
     * select control.
     * @property {string} id - A unique identifier for the input field. Used in
     * conjunction with the <label> element's htmlFor attribute to associate the
     * label with this input field.
     * @property {string} name - Determines the name for the input field. When the
     * form is submitted, the data sent to the server will include a key-value pair
     * where the key is the name of the input field and the value is the file the
     * user has uploaded.
     * @property {string} accept - Limits the types of files that the user can
     * select to image files. The /* means any file type that falls under the image
     * category.
     */
    return (
        <Wrapper>
            {/* encType is used to send form data as formData */}
            <Form method='post' className='form' encType='multipart/form-data'>
                <h4 className='form-title'>profile</h4>

                <div className='form-center'>

                    {/* file input - Hard coded */}
                    <div className='form-row'>
                        <label htmlFor='image' className='form-label'>
                            Select an image file (max 0.5 MB):
                        </label>
                        <input
                            type='file'
                            id='avatar'
                            name='avatar'
                            className='form-input'
                            accept='image/*'
                        />
                    </div>

                    {/* file input */}
                    <FormRow type='text' name='name' defaultValue={name} />
                    <FormRow
                        type='text'
                        labelText='last name'
                        name='lastName'
                        defaultValue={lastName}
                    />
                    <FormRow type='email' name='email' defaultValue={email} />
                    <FormRow type='text' name='location' defaultValue={location} />

                    <SubmitBtn formBtn />
                </div>
            </Form>
        </Wrapper>
    )
}
export default Profile



// -------------------------- SERVER SIDE --------------------------- //


export const action = async ({ request }) => {

    const formData = await request.formData();

    // formData interface has a get method where we can provide the input value we want
    // to access. In this case -> accessing the 'avatar' input field. We check this as
    // the user may not provide an image file. Eg When changing the name but not the image.
    const file = formData.get('avatar');
    if (file && file.size > 500000) {
        toast.error('Image size too large');
        return null;
    }

    try {
        await customFetch.patch('/users/update-user', formData);
        toast.success('Profile updated successfully');
    } catch (error) {
        toast.error(error?.response?.data?.msg);
    }
    return null;
};