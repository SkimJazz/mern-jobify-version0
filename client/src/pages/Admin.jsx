import { FaSuitcaseRolling, FaCalendarCheck } from 'react-icons/fa';
import { useLoaderData, redirect } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import Wrapper from '../assets/wrappers/StatsContainer';
import { toast } from 'react-toastify';

import { StatItem } from '../components';



//1. Create Loader Function to fetch data from the server
export const loader = async () => {
    try {
        const response = await customFetch.get('/users/admin/app-stats');
        return response.data;
    } catch (error) {
        toast.error('You are not authorized to view this page');
        // Only admin has access to this page. All other users are redirected
        return redirect('/dashboard');
    }
};


//2. Create Admin Component
const Admin = () => {
    // 3. Use useLoaderData hook to get users and jobs data
    const { users, jobs } = useLoaderData();

    return (

        <Wrapper>
            <StatItem
                title='current users'
                count={users}
                color='#e9b949'
                bcg='#fcefc7'
                icon={<FaSuitcaseRolling />}
            />
            <StatItem
                title='total jobs'
                count={jobs}
                color='#647acb'
                bcg='#e0e8f9'
                icon={<FaCalendarCheck />}
            />
        </Wrapper>
    );
};
export default Admin
