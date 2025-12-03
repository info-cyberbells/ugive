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

//update superadmin profile
export const updateSuperAdminProfileService = async (formData) => {
    const auth = getAuthHeader();

    const res = await axios.put(
        USER_ENDPOINTS.SUPERADMIN_UPDATE_PROFILE,
        formData,
        {
            headers: {
                ...auth.headers,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return res.data;
};

// super admin change password service
export const changeSuperAdminPasswordService = async (data) => {
    const response = await axios.put(
        USER_ENDPOINTS.SUPERADMIN_CHANGE_PASSWORD,
        data,
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


// create college
export const createCollegeService = async (collegeData) => {
    const response = await axios.post(USER_ENDPOINTS.SUPERADMIN_ADD_COLLEGE,
        collegeData,
        getAuthHeader()
    );
    return response.data;
};

//get single college data -suuperadmin
export const getSingleCollegeService = async (id) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.SUPERADMIN_GET_SINGLE_COLLEGE}/${id}`,
        getAuthHeader()
    );
    return response.data;
};

// update College
export const updateCollegeService = async (id, collegeData) => {
    const response = await axios.put(
        `${USER_ENDPOINTS.SUPERADMIN_UPDATE_COLLEGE}/${id}`,
        collegeData,
        getAuthHeader(),
    );
    return response.data;
}

//delete college - superadmin
export const deleteCollegeService = async (id) => {
    const response = await axios.delete(
        `${USER_ENDPOINTS.SUPERADMIN_DELETE_COLLEGE}/${id}`,
        getAuthHeader()
    );
    return response.data;
};



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

// create student
export const createStudentService = async (collegeData) => {
    const response = await axios.post(USER_ENDPOINTS.SUPERADMIN_ADD_STUDENT,
        collegeData,
        getAuthHeader()
    );
    return response.data;
};

//get single student data -suuperadmin
export const getSingleStudentService = async (id) => {
    const response = await axios.get(
        `${USER_ENDPOINTS.SUPERADMIN_GET_SINGLE_STUDENT}/${id}`,
        getAuthHeader()
    );
    return response.data;
};

// update student data
export const updateStudentService = async ({ studentId, data }) => {
    const response = await axios.put(
        `${USER_ENDPOINTS.SUPERADMIN_UPDATE_STUDENT}/${studentId}`,
        data,
        getAuthHeader(),
    );
    return response.data;
}

//delete student superadmin
export const deleteStudentService = async (id) => {
    const response = await axios.delete(
        `${USER_ENDPOINTS.SUPERADMIN_DELETE_STUDENT}/${id}`,
        getAuthHeader()
    );
    return response.data;
};

//student get profile   
export const getStudentProfileService = async () => {
    const response = await axios.get(
        USER_ENDPOINTS.STUDENT_GET_PROFILE,
        getAuthHeader()
    );
    return response.data;
}


// update student profile

export const updateStudentProfileService = async (formData) => {
  const auth = getAuthHeader();  

  const response = await axios.put(
    USER_ENDPOINTS.STUDENT_UPDATE_PROFILE,
    formData,
    {
      headers: {
        ...auth.headers,                     
        "Content-Type": "multipart/form-data",     
      }
    }
  );

  return response.data;
};

// change password service student
export const changeStudentPasswordService = async (data) => {
    const response = await axios.put(
        USER_ENDPOINTS.STUDENT_CHANGE_PASSWORD,
        data,
        getAuthHeader()
    );
    return response.data;
};

// get all rewards
export const getAllRewardsService = async () => {
    const response = await axios.get(USER_ENDPOINTS.SUPERADMIN_GET_ALL_REWARDS,
        getAuthHeader()
    );
    return response.data;
}