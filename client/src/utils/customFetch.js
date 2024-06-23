import axios from 'axios';

const customFetch = axios.create({
    baseURL: '/api/v0',
});

export default customFetch;