import axios from 'axios';
const api = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}/auth` || 'http://localhost:4000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
export const googleAuth =(code)=> api.get(`/google?code=${code}`)