import axios from "axios";
import USER_ENDPOINTS from "./authRoutes";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return {
        withCredentials: true,
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    };
};


//Login Student
export const loginService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.LOGIN_USER, userData);
    return response.data;
};

//Register Student
export const registerService = async (userData) => {
    const response = await axios.post(USER_ENDPOINTS.REGISTER_USER, userData);
    return response.data;
}

//get all pubic universities - atsignup
export const getPublicUniversitiesService = async () => {
    const response = await axios.get(USER_ENDPOINTS.PUBLIC_UNIVERSITIES);
    return response.data;
}

//get specific college of a university - at signup 
export const getCollegesService = async (universityId) => {
    const response = await axios.get(`${USER_ENDPOINTS.PUBLIC_UNIVERSITIES}/${universityId}/colleges`);
    return response.data;
};




//get superadmin profile
export const getSuperAdminProfileService = async () => {
    const response = await axios.get(
        USER_ENDPOINTS.SUPERADMIN_GET_PROFILE,
        getAuthHeader()
    );
    return response.data;
};

//create university - superadmmin
export const createUniversityService = async (uniData) => {
    const response = await axios.post(USER_ENDPOINTS.SUPERADMIN_ADD_UNIVERSITY,
        uniData,
        getAuthHeader()
    );
    return response.data;
};

//update university - superadmin
export const updateUniversityService = async (id, uniData) => {
    const response = await axios.put(
        `${USER_ENDPOINTS.SUPERADMIN_UPDATE_UNIVERSITY}/${id}`,
        uniData,
        getAuthHeader(),
    );
    return response.data;
}

// get All Universities Data
export const getAllUniversitiesDataService = async (uniData) => {
    const response = await axios.get(
        USER_ENDPOINTS.SUPERADMIN_GET_ALL_UNIVERSITY, {
        params: uniData,
        ...getAuthHeader(),
    },
    );
    return response.data;
}

//get single university data -suuperadmin
export const getSingleUniversityService = async (id) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.SUPERADMIN_GET_SINGLE_UNIVERSITY}/${id}`,
        getAuthHeader()
    );
    return response.data;
};

//delete unniversity - superadmin
export const deleteUniversityService = async (id) => {
    const response = await axios.delete(
        `${USER_ENDPOINTS.SUPERADMIN_DELETE_UNIVERSITY}/${id}`,
        getAuthHeader()
    );
    return response.data;
};



// get all colleges data
export const getAllCollegesDataService = async (uniData) => {
    const response = await axios.get(
        USER_ENDPOINTS.SUPERADMIN_GET_ALL_COLLEGES, {
        params: uniData,
        ...getAuthHeader(),
    },
    );
    return response.data;
}

// get all student data
export const getAllStudentDataService = async (studentData) => {
    const response = await axios.get(
        USER_ENDPOINTS.SUPERADMIN_GET_ALL_STUDENTS, {
        params: studentData,
        ...getAuthHeader(),
    },
    );
    return response.data;
}

//get single college - superadmin
export const getSingleCollegeService = async (collegeId) => {
    return axios.get(
        `${USER_ENDPOINTS.SUPERADMIN_GET_SINGLE_COLLEGE}/${collegeId}`
    ).then(res => res.data);
};

//add new college -  superadmin
export const addCollegeService = async (data) => {
    return axios.post(
        USER_ENDPOINTS.SUPERADMIN_ADD_COLLEGE,
        data
    ).then(res => res.data);
};

//update  college  -  superadmin
export const updateCollegeService = async (collegeId, data) => {
    return axios.put(
        `${USER_ENDPOINTS.SUPERADMIN_UPDATE_COLLEGE}/${collegeId}`,
        data
    ).then(res => res.data);
};

//delete college - superadmin
export const deleteCollegeService = async (collegeId) => {
    return axios.delete(
        `${USER_ENDPOINTS.SUPERADMIN_DELETE_COLLEGE}/${collegeId}`
    ).then(res => res.data);
};