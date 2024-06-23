import { Link, Form, redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


import { FormRow, Logo, SubmitBtn } from '../components';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/RegisterAndLoginPage';


export const action = async ({request}) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
        await customFetch.post('/auth/login', data);
        toast.success('Login successful', {autoClose: 1500});
        return redirect('/dashboard');
    }   catch (error) {
        toast.error(error?.response?.data?.msg);
        return error;
    }
};



const Login = () => {

    const navigate = useNavigate();
    const loginDemo = async () => {
        const data = {
            email: 'test@test.com',
            password: 'secret123',
        };
        try {
            await customFetch.post('/auth/login', data);
            toast.success('take a test drive', {autoClose: 1500});
            navigate('/dashboard');
        }   catch (error) {
            toast.error(error?.response?.data?.msg);
        }
    };
    return (
        <Wrapper>

            {/*Global className of form: Ref RegisterAndLonginPage.js*/}
            <Form method='post' className='form'>
                <Logo/>
                <h4> login </h4>
                <FormRow type='email' name='email' />
                <FormRow type='password' name='password' />

                <SubmitBtn formBtn/>

                {/*User Login Submit*/}
                {/*<button type='submit' className='btn btn-block' disabled={isSubmitting}>*/}
                {/*    {isSubmitting ? 'submitting...' : 'submit'}*/}
                {/*</button>*/}

                {/*Demo login to explore Jobify app. Use type=button and not submit*/}
                <button type='button' className='btn btn-block' onClick={loginDemo}>
                    explore the app
                </button>

                <p>
                    Not a member yet?
                    {/*Navigate back to Register page*/}
                    <Link to='/register' className='member-btn'>
                        Register
                    </Link>
                </p>

            </Form>
        </Wrapper>
    );
};
export default Login
