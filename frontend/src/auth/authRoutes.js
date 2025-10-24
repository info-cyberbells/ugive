export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
    LOGIN_USER: `${API_BASE_URL}/auth/login`,
    REGISTER_USER: `${API_BASE_URL}/auth/register`,

};


export default USER_ENDPOINTS;