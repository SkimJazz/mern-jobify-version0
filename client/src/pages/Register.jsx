import { Form, redirect, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Wrapper from '../assets/wrappers/RegisterAndLoginPage';
import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch.js';



export const action = async ({request}) => {
    const formData = await request.formData();
    // console.log(formData);
    const data = Object.fromEntries(formData);
    // console.log(data);
    try {
        await customFetch.post('/auth/register', data);
        toast.success('Registration successful', { autoClose: 1500 });
        return redirect('/login');
    }   catch (error) {
        toast.error(error?.response?.data?.msg);
        // console.log(error);
        return error;
    }
}


const Register = () => {

    // const navigation = useNavigation();
    // const isSubmitting = navigation.state === 'submitting';

    return (

        <Wrapper>
            <Form method='post' className='form'>
                <Logo/>
                <h4>Register</h4>
                <FormRow type='text' name='name' />
                <FormRow
                    type='text'
                    labelText='last name'
                    name='lastName'

                />
                <FormRow type='text' name='location'  />
                <FormRow type='email' name='email'  />
                <FormRow type='password' name='password'  />

                {/*<button type='submit' className='btn btn-block' disabled={isSubmitting}>*/}
                {/*    {isSubmitting ? 'submitting...' : 'submit'}*/}
                {/*</button>*/}

                <SubmitBtn formBtn />

                <p>
                    Already a member?
                    <Link to='/login' className='member-btn'>
                        Login
                    </Link>
                </p>

            </Form>
        </Wrapper>
    );
};
export default Register;
