export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
    LOGIN_USER: `${API_BASE_URL}/auth/login`,
    REGISTER_USER: `${API_BASE_URL}/auth/register`,
    PUBLIC_UNIVERSITIES: `${API_BASE_URL}/public/universities`,


    SUPERADMIN_GET_PROFILE: `${API_BASE_URL}/super_admin/profile`,

    SUPERADMIN_ADD_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,
    SUPERADMIN_UPDATE_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,
    SUPERADMIN_GET_ALL_UNIVERSITY: `${API_BASE_URL}/super_admin/get-all-universities`,
    SUPERADMIN_GET_SINGLE_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,
    SUPERADMIN_DELETE_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,



    SUPERADMIN_GET_ALL_COLLEGES: `${API_BASE_URL}/super_admin/get-all-colleges`,
    SUPERADMIN_GET_SINGLE_COLLEGE: `${API_BASE_URL}/super_admin/colleges`, 
    SUPERADMIN_ADD_COLLEGE: `${API_BASE_URL}/super_admin/colleges`,
    SUPERADMIN_UPDATE_COLLEGE: `${API_BASE_URL}/super_admin/colleges`,
    SUPERADMIN_DELETE_COLLEGE: `${API_BASE_URL}/super_admin/colleges`,


    SUPERADMIN_GET_ALL_STUDENTS: `${API_BASE_URL}/super_admin/get-all-students`,


};


export default USER_ENDPOINTS;