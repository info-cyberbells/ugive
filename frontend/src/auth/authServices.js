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
};

//get all pubic universities - atsignup
export const getPublicUniversitiesService = async () => {
  const response = await axios.get(USER_ENDPOINTS.PUBLIC_UNIVERSITIES);
  return response.data;
};

//get specific college of a university - at signup
export const getCollegesService = async (universityId) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.PUBLIC_UNIVERSITIES}/${universityId}/colleges`
  );
  return response.data;
};

// Send reset code to email
export const forgotPasswordService = async (email) => {
  const response = await axios.post(USER_ENDPOINTS.FORGOT_PASSWORD, { email });
  return response.data;
};

// Verify code + update password
export const resetPasswordService = async (payload) => {
  const response = await axios.post(USER_ENDPOINTS.RESET_PASSWORD, payload);
  return response.data;
};

//get social media link service

export const getSocialLinksService = async () => {
  const response = await axios.get(USER_ENDPOINTS.GET_SOCIAL_LINKS);
  return response.data;
};

// add social links
export const addSocialLinkService = async (formData) => {
  const response = await axios.post(USER_ENDPOINTS.ADD_SOCIAL_LINKS, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// update social link service
export const updateSocialLinkService = async (id, data) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.UPDATE_SOCIAL_LINKS}/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// delete social link
export const deleteSocialLinkService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.DELETE_SOCIAL_LINKS}/${id}`
  );
  return response.data;
};

// Get superadmin  notifications
export const getSuperAdminNotificationsService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.GET_SUPERADMIN_NOTIFICATIONS,
    getAuthHeader()
  );
  return response.data;
};

//get superadmin dashbaord data
export const getSuperAdminDashboardService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.SUPERADMIN_DASHBAORD,
    getAuthHeader()
  );
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
  const response = await axios.post(
    USER_ENDPOINTS.SUPERADMIN_ADD_UNIVERSITY,
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
    getAuthHeader()
  );
  return response.data;
};

// get All Universities Data
export const getAllUniversitiesDataService = async (uniData) => {
  const response = await axios.get(
    USER_ENDPOINTS.SUPERADMIN_GET_ALL_UNIVERSITY,
    {
      params: uniData,
      ...getAuthHeader(),
    }
  );
  return response.data;
};

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
  const response = await axios.get(USER_ENDPOINTS.SUPERADMIN_GET_ALL_COLLEGES, {
    params: uniData,
    ...getAuthHeader(),
  });
  return response.data;
};

// create college
export const createCollegeService = async (collegeData) => {
  const response = await axios.post(
    USER_ENDPOINTS.SUPERADMIN_ADD_COLLEGE,
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
    getAuthHeader()
  );
  return response.data;
};

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
  const response = await axios.get(USER_ENDPOINTS.SUPERADMIN_GET_ALL_STUDENTS, {
    params: studentData,
    ...getAuthHeader(),
  });
  return response.data;
};

// create student
export const createStudentService = async (collegeData) => {
  const response = await axios.post(
    USER_ENDPOINTS.SUPERADMIN_ADD_STUDENT,
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
    getAuthHeader()
  );
  return response.data;
};

//delete student superadmin
export const deleteStudentService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.SUPERADMIN_DELETE_STUDENT}/${id}`,
    getAuthHeader()
  );
  return response.data;
};

// get all rewards
export const getAllRewardsService = async (query) => {
  const response = await axios.get(USER_ENDPOINTS.SUPERADMIN_GET_ALL_REWARDS, {
    params: query,
    ...getAuthHeader(),
  });
  return response.data;
};

//create a reward - superadmin
export const createRewardService = async (rewardData) => {
  const authHeader = getAuthHeader();

  const response = await axios.post(
    USER_ENDPOINTS.SUPERADMIN_ADD_REWARD,
    rewardData,
    {
      headers: {
        ...authHeader.headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// delete reward super admin
export const deleteRewardService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.SUPERADMIN_DELETE_REWARD}/${id}`,
    getAuthHeader()
  );
  return response.data;
};

//get single reward
export const getSingleRewardService = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.SUPERADMIN_GET_SINGLE_REWARD}/${id}`,
    getAuthHeader()
  );
  return response.data;
};

//update reward data
export const updateRewardService = async (id, rewardData) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.SUPERADMIN_UPDATE_REWARD}/${id}`,
    rewardData,
    getAuthHeader()
  );
  return response.data;
};

// get feedback service

export const getFeedbackService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.SUPERADMIN_GET_ALL_FEEDBACKS,
    getAuthHeader()
  );
  return response.data;
};

// delete feedback

export const deleteFeedbackService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.SUPERADMIN_DELETE_FEEDBACK}/${id}`,
    getAuthHeader()
  );
  return response.data;
};

// GET ALL ADMINS BY SUPERADMIN

export const getAllAdminsBySuperAdminService = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.SUPERADMIN_GET_ADMINS}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  )
  return response.data;
}

// CREATE ADMIN (SUPER ADMIN)
export const createAdminService = async (adminData) => {
  const response = await axios.post(
    USER_ENDPOINTS.SUPERADMIN_CREATE_ADMIN,
    adminData,
    getAuthHeader(),
  );
  return response.data;
};

// GET SINGLE ADMIN (SUPER ADMIN)
export const getSingleAdminService = async (adminId) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.SUPERADMIN_VIEW_ADMIN}/${adminId}`,
    getAuthHeader(),
  );
  return response.data;
};


//  Update ADMIN (SUPER ADMIN)
export const updateAdminDetailsService = async (id, payload) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.SUPERADMIN_UPDATE_ADMIN}/${id}`,
    payload,
    getAuthHeader()
  );
  return response.data;
};

// DELETE ADMIN (SUPER ADMIN)
export const deleteAdminService = async (adminId) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.SUPERADMIN_VIEW_ADMIN}/${adminId}`,
    getAuthHeader(),
  );
  return response.data;
};


// GET ALL VENDORS (SUPER ADMIN)
export const getAllVendorsSuperadminService = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.SUPERADMIN_GET_ALL_VENDORS}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  );
  return response.data;
}

// CREATE VENDER (SUPER ADMIN)
export const createVendorBySuperAdminService = async (details) => {
  const auth = getAuthHeader();
  const response = await axios.post(
    USER_ENDPOINTS.SUPERADMIN_CREATE_VENDOR,
    details,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
}

// VIEW VENDOR PROFILE
export const viewVendorProfileBySuperAdmin = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.SUPERADMIN_GET_SINGLE_VENDOR}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}

// UPDATE VENDORS PROFILE
export const updateVendorsProfileBySuperAdminService = async (id, details) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.SUPERADMIN_UPDATE_VENDOR}/${id}`,
    details,
    getAuthHeader(),
  );
  return response.data;
}

//DELETE VENDOR (SUPER-ADMIN)
export const deleteVendorBySuperAdminService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.SUPERADMIN_DELETE_VENDOR}/${id}`,
    getAuthHeader(),
  );
  return response;
}

//show vendor rewards
export const getVendorRewardsBySuperAdminService = async (params = {}) => {
  const response = await axios.get(
    USER_ENDPOINTS.SHOW_VENDORS_REWARDS,
    {
      ...getAuthHeader(),
      params,
    }
  );
  return response.data;
};

// PUT audit vendor reward (approve / reject / update)
export const auditVendorRewardBySuperAdminService = async (id, payload) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.AUDIT_VENDORS_REWARD}/${id}`,
    payload,
    getAuthHeader()
  );
  return response.data;
};


// GET ACTIVE PUBLIC REWARDS
export const getActiveRewardsService = async (universityId) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.PUBLIC_ACTIVE_REWARDS}?universityId=${universityId}`
  );
  return response.data;
};

//create reward by superadmin
export const createRewardBySuperAdminService = async (formData) => {
  const auth = getAuthHeader();
  const response = await axios.post(
    USER_ENDPOINTS.SUPERADMIN_CREATE_REWARD,
    formData,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data"
      },
    }
  );
  return response.data;
}
 
// DELETE REWARD BY VENDOR
export const deleterewardBySuperAdminService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.SUPERADMIN_DELETE_REWARD}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}










// ADMIN SERVICES

// GET ADMIN DASHBOARD DATA
export const getAdminDashboardDataService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.ADMIN_DASHBOARD_DATA,
    getAuthHeader(),
  )
  return response.data;
}

// GET ADMIN PROFILE SERVICE
export const getAdminProfileService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.ADMIN_GET_PROFILE,
    getAuthHeader()
  );
  return response.data;
};

// UPDATE ADMIN PROFILE
export const updateAdminProfileService = async (formData) => {
  const auth = getAuthHeader();
  const response = await axios.put(
    USER_ENDPOINTS.ADMIN_UPDATE_PROFILE,
    formData,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

// CHANGE ADMIN PASSWORD SERVICE
export const changeAdminPasswordService = async (data) => {
  const response = await axios.put(
    USER_ENDPOINTS.ADMIN_CHANGE_PASSWORD,
    data,
    getAuthHeader(),
  );
  return response.data;
}


// GET COLLEGES FOR ADMIN

export const getAdminCollegesService = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_ALL_COLLEGES}?page=${page}&limit=${limit}`,
    getAuthHeader()
  );
  return response.data;
};

// get single university for admin
export const getSingleUniversityForAdminService = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_SINGLE_UNIVERSITY}/${id}`,
    getAuthHeader()
  );
  return response.data;
};

// ADD COLLEGE BY ADMIN
export const addCollegeAdminService = async (collegeData) => {
  const response = await axios.post(
    USER_ENDPOINTS.ADMIN_ADD_COLLEGE,
    collegeData,
    getAuthHeader()
  );
  return response.data;
};

// VIEW COLLEGE BY ADMIN
export const viewSingleCollegeAdminService = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_VIEW_SINGLE_COLLEGE}/${id}`,
    getAuthHeader()
  );
  return response.data;
};

// UPDATE COLLEGE BY ADMIN

export const updateCollegeAdminService = async (id, collegeData) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.ADMIN_UPDATE_COLLEGE}/${id}`,
    collegeData,
    getAuthHeader()
  );
  return response.data;
};

// DELETE COLLEGE BY ADMIN
export const deleteCollegeAdminService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.ADMIN_DELETE_COLLEGE}/${id}`,
    getAuthHeader()
  );
  return response.data;
};

// GET CARDS TO ADMIN ON BASES OF UNIVERSITY
export const getUniversityCardsForAdminService = async ({ page = 1, limit = 10, }) => {

  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_UNI_CARDS}?page=${page}&limit=${limit}`,
    getAuthHeader()
  );

  return response.data;
};

// UPDATE CARD STATUS BY ADMIN
export const updateCardStatusByAdminService = async ({ cardId, status }) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.ADMIN_UPDATE_CARD_STATUS}/${cardId}`,
    { status },
    getAuthHeader(),
  );
  return response.data;
}

// DELETE CARD BY ADMIN 
export const deleteCardByAdminService = async (cardId) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.ADMIN_DELETE_CARD}/${cardId}`,
    getAuthHeader(),
  );
  return response.data;
}

// GET ALL STUDENTS SERVICE FOR ADMIN

export const getAllStudentsForAdminService = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_ALL_STUDENTS}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  );
  return response.data;
}

// CRETAE STUDENT BY ADMIN SERVICE
export const createStudentByAdminService = async (studentData) => {
  const response = await axios.post(
    USER_ENDPOINTS.ADMIN_CREATE_STUDENT,
    studentData,
    getAuthHeader(),
  );
  return response.data;
};

//GET SINGLE STUDENT DETAILS BY ADMIN SERVICE
export const getSingleStudentDetailsByAdminService = async (studentId) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_SINGLE_STUDENT}/${studentId}`,
    getAuthHeader(),
  );
  return response.data;
}

//UPDATE SINGLE STUDENT DETAILS BY ADMIN SERVICE

export const updateStudentDetailsByAdminService = async ({ studentId, studentData }) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.ADMIN_UPDATE_STUDENT}/${studentId}`,
    studentData,
    getAuthHeader(),
  );
  return response.data;
}

// DELETE STUDENT BY ADMIN SERVICE
export const deleteStudentByAdminService = async (studentId) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.ADMIN_DELETE_STUDENT}/${studentId}`,
    getAuthHeader(),
  );
  return response.data;
}


// GET ADMIN NOTIFICATIONS SERVICE
export const getAdminNotificationsService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.ADMIN_GET_NOTIFICATIONS,
    getAuthHeader(),
  );
  return response.data;
}

// SEND FEEDBACK BY ADMIN SERVICE
export const sendFeedbackByAdminService = async (feedback) => {
  const response = await axios.post(
    USER_ENDPOINTS.ADMIN_SEND_FEEDBACK,
    { feedback },
    getAuthHeader(),
  );
  return response.data;
}


// GET ALL VENDORS BY ADMIN
export const getAllVendorsByAdminService = async ({ limit = 10, page = 1 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_ALL_VENDORS}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  );
  return response.data;
}

// CREATE VENDOR BY ADMIN
export const createVendorByAdminService = async (details) => {
  const auth = getAuthHeader();
  const response = await axios.post(
    USER_ENDPOINTS.ADMIN_CREATE_VENDOR,
    details,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

// VIEW VENDOR PROFILE BY ADMIN
export const viewVendorProfileByAdminService = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_VENDOR}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}

// UPDATE VENDOR PROFILE BY ADMIN
export const updateVendorProfileByAdminService = async (id, payload) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.ADMIN_UPDATE_VENDOR}/${id}`,
    payload,
    getAuthHeader(),
  );
  return response.data;
}

//DELETE VENDOR PROFILE BY ADMIN
export const deleteVendorProfileByAdminService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.ADMIN_DELETE_VENDOR}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}

// GET ALL REWARDS (ADMIN)
export const getAllRewardsByAdminService = async ({ page = 1, limit = 10 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_ALL_REWARD}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  );
  return response.data;
}

//CREATE REWARD BY ADMIN
export const createRewardByAdminService = async (payload) => {
  const auth = getAuthHeader();
  const response = await axios.post(
    USER_ENDPOINTS.ADMIN_CREATE_REWARD,
    payload,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data",
      }
    },
  );
  return response.data;
}

// VIEW REWARD BY ADMIN
export const viewSingleRewardByAdminService = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_VIEW_REWARD}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}


export const updateRewardByAdminService = async ({ id, formData }) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.ADMIN_UPDATE_REWARD}/${id}`,
    formData,
    getAuthHeader()
  );

  return response.data;
};
export const deleteRewardByAdminService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.ADMIN_DELETE_REWARD}/${id}`,
    getAuthHeader()
  );

  return response.data;
};


// Store QR code data in admin
export const storeCardQRService = async (cardId, qrData) => {
  const response = await axios.post(
    `${USER_ENDPOINTS.ADMIN_STORE_CARD_QR}`,
    { cardId, qrData },
    getAuthHeader()
  );
  return response.data;
};

// GET ACTIVE REWARDS BY ADMIN
export const getActiveRewardsAdminService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.ADMIN_GET_ACTIVE_REWARD,
    getAuthHeader(),
  );
  return response.data;
}


//CREATE VENDOR REWARD BY ADMIN
export const createVendorRewardByAdminService = async (rewardData)=>{
  const auth = getAuthHeader();
  const response = await axios.post(
    USER_ENDPOINTS.ADMIN_CREATE_VENDOR_REWARD, rewardData,{
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data"
      },
    },
  );
  return response.data;
}

// GET ALL REWARD VENDOR BY ADMIN
export const getAllVendorRewardByAdminService = async ({ limit = 10, page = 1 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_ALL_VENDOR_REWARD}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  );
  return response.data;
}

// VIEW REWARD VENDOR BY ADMIN
export const viewSingleVendorRewardByAdminService = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.ADMIN_GET_SINGLE_VENDOR_REWARD}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}

// UPDATE VENDOR REWARD BY ADMIN
export const updateVendorRewardByAdminService = async ({ id, formData }) => {
  const auth = getAuthHeader();
  const response = await axios.put(
    `${USER_ENDPOINTS.ADMIN_UPDATE_SINGLE_VENDOR_REWARD}/${id}`,
    formData,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data"
      },
    },
  );
  return response.data;
}

// DELETE VENDOR REWARD BY ADMIN
export const deleteVendorRewardByAdminService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.ADMIN_DELETE_VENDOR_REWARD}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}
















// VENDORS API SERVICE

//   VENDOR GET OWN PROFILE SERVICE

export const getVendorOwnProfileService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.VENDOR_PROFILE,
    getAuthHeader(),
  );
  return response.data;
}


// UPADATE PROFILE SERVICE (VENDOR)
export const updateProfileByVendorService = async (details) => {
  const auth = getAuthHeader();

  const response = await axios.put(
    USER_ENDPOINTS.VENDOR_UPDATE_PROFILE,
    details,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data",
      }
    }
  );
  return response.data;
}

// CHANGE PASSWORD SERVICE (SERVICE)
export const changePasswordVendorService = async (data) => {
  const response = await axios.put(
    USER_ENDPOINTS.VENDOR_CHANGE_PASSWORD,
    data,
    getAuthHeader(),
  );
  return response.data;
}

// GET NOTIFICATION FOR VENDOR
export const getNotificationVendorService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.VENDOR_NOTIFICATION,
    getAuthHeader(),
  );
  return response.data;
}

// GET PRINTED CRADS
export const getPrintedCardVendorService = async ({ limit = 10, page = 1 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.VENDOR_PRINTED_CARDS}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  );
  return response.data;
}

// update card Status 
export const updateCardStatusVendorService = async (id, status) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.VENDOR_UPDATE_CARD_STATUS}/${id}`,
    { status },
    getAuthHeader(),
  );
  return response.data;
}

// GET ALL REWARD VENDOR
export const getAllRewardVendorService = async ({ limit = 10, page = 1 }) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.VENDOR_GET_ALL_REWARDS}?page=${page}&limit=${limit}`,
    getAuthHeader(),
  );
  return response.data;
}

// Verify QR code
export const verifyCardQRService = async (qrData) => {

  const response = await axios.post(
    `${USER_ENDPOINTS.VENDOR_VERIFY_QR}`,
    { qrData },
    getAuthHeader()
  );
  return response.data;
};

// VENDOR DASHBOARD 
export const getVendorDashboardService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.VENDOR_DASHBOARD,
    getAuthHeader(),
  );
  return response.data;
}

// CREATE REWARD BY VENDOR
export const createRewardByVendorService = async (formData) => {
  const auth = getAuthHeader();
  const response = await axios.post(
    USER_ENDPOINTS.VENDOR_CREATE_REWARD,
    formData,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data"
      },
    }
  );
  return response.data;
}

// VIEW REWARD BY VENDOR
export const viewSingleRewardByVendorService = async (id) => {
  const response = await axios.get(
    `${USER_ENDPOINTS.VENDOR_VIEW_REWARD}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}

// UPDATE REWARD BY Vendor
export const updateRewardByVendorService = async ({ id, formData }) => {
  const auth = getAuthHeader();
  const response = await axios.put(
    `${USER_ENDPOINTS.VENDOR_UPDATE_REWARD}/${id}`,
    formData,
    {
      headers: {
        ...auth.headers,
        "Content-Type": "multipart/form-data"
      },
    },
  );
  return response.data;
}

// DELETE REWARD BY VENDOR
export const deleterewardByVendorService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.VENDOR_DELETE_REWARD}/${id}`,
    getAuthHeader(),
  );
  return response.data;
}















// get student dashboard
export const getstudentDashboardService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.STUDENT_DASHBOARD,
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
};

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
      },
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

//get a rewards for student college
export const getStudentRewardsService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.GET_ALL_REWARDS,
    getAuthHeader()
  );
  return response.data;
};

// send a card student
export const sendCardService = async (card) => {
  const response = await axios.post(
    USER_ENDPOINTS.STUDENT_SEND_CARD,
    card,
    getAuthHeader()
  );
  return response.data;
};

//check card eligibility
export const checkCardEligibilityService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.CHECK_CARD_ELIGIBILITY,
    getAuthHeader()
  );
  return response.data;
};

// GET CARD LISTINGS

export const getCardListingService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.GET_SENT_CARDS_LISTING,
    getAuthHeader()
  );
  return response.data;
};

//DELETE STUDENT ACCOUNT SERVICE
export const deleteStudentAccountService = async () => {
  const response = await axios.post(
    USER_ENDPOINTS.STUDENT_DELETE_ACCOUNT,
    {},
    getAuthHeader()
  );
  return response.data;
};

// SEND FEEDBACK BY STUDENT SERVICE
export const sendFeedbackStudentService = async (feedback) => {
  const response = await axios.post(
    USER_ENDPOINTS.STUDENT_SEND_FEEDBACK,
    { feedback },
    getAuthHeader()
  );
  return response.data;
};

// STUDENTS REWARD CLAIM

export const claimRewardStudentService = async (rewardId) => {
  const response = await axios.post(
    USER_ENDPOINTS.STUDENT_REWARDS_CLAIM,
    { rewardId },
    getAuthHeader()
  );

  return response.data;
};
// Search users
export const searchUsersService = async (name, email, college, university, filterMode = "global") => {
  const params = new URLSearchParams();

  if (filterMode === "college" && college) {
    params.append("college", college);
  } else if (filterMode === "university" && university) {
    params.append("university", university);
  } else {
    if (name) params.append("name", name);
    if (email) params.append("email", email);
  }

  const response = await axios.get(
    `${USER_ENDPOINTS.SEARCH_USERS}?${params.toString()}`,
    getAuthHeader()
  );
  return response.data;
};

// Get friends list
export const getFriendsListService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.GET_FRIENDS_LIST,
    getAuthHeader()
  );
  return response.data;
};

// Send friend request
export const sendFriendRequestService = async (receiverId) => {
  const response = await axios.post(
    USER_ENDPOINTS.SEND_FRIEND_REQUEST,
    { receiverId },
    getAuthHeader()
  );
  return response.data;
};

// Accept friend request
export const acceptFriendRequestService = async (requestId) => {
  const response = await axios.post(
    USER_ENDPOINTS.ACCEPT_FRIEND_REQUEST,
    { requestId },
    getAuthHeader()
  );
  return response.data;
};

// Delete/reject friend request
export const deleteFriendRequestService = async (requestId) => {
  const response = await axios.post(
    USER_ENDPOINTS.DELETE_FRIEND_REQUEST,
    { requestId },
    getAuthHeader()
  );
  return response.data;
};

// Unfriend a friend
export const unfriendService = async (friendId) => {
  const response = await axios.post(
    USER_ENDPOINTS.UNFRIEND,
    { friendId },
    getAuthHeader()
  );
  return response.data;
};

// Get sent friend requests
export const getSentRequestsService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.GET_SENT_REQUESTS,
    getAuthHeader()
  );
  return response.data;
};

// Get received friend requests
export const getReceivedRequestsService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.GET_RECEIVED_REQUESTS,
    getAuthHeader()
  );
  return response.data;
};

// GET STUDENT STREAK SUMMARY

export const getStreakSummaryService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.STUDENT_STREAK_SUMMARY,
    getAuthHeader()
  );
  return response.data;
};

//  GET REMIANING CARDS PROGRESS
export const getRemainingCardService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.STUDENT_REMAINING_CARD,
    getAuthHeader()
  );
  return response.data;
};

// Get student notifications
export const getStudentNotificationsService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.GET_STUDENT_NOTIFICATIONS,
    getAuthHeader()
  );
  return response.data;
};

// CHECK FOR BAN WORDS WHILE SENDING CARD
export const checkBanWordsService = async (message) => {
  const response = await axios.post(
    "https://ugive.com.au/banword/process_text",
    {
      text: message,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};


// GET COLLEGE FRIENDS
export const getStudentCollegePeopleService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.COLLEGE_PEOPLE,
    getAuthHeader(),
  );
  return response.data;
}



// Push Notification Services
export const createNotificationService = async (data) => {
  const response = await axios.post(
    USER_ENDPOINTS.ADMIN_CREATE_NOTIFICATION,
    data,
    getAuthHeader()
  );
  return response.data;
};

export const getAllNotificationsService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.ADMIN_GET_ALL_NOTIFICATIONS,
    getAuthHeader()
  );
  return response.data;
};

export const toggleNotificationService = async (id) => {
  const response = await axios.patch(
    `${USER_ENDPOINTS.ADMIN_TOGGLE_NOTIFICATION}/${id}`,
    {},
    getAuthHeader()
  );
  return response.data;
};

export const updateNotificationService = async (id, data) => {
  const response = await axios.put(
    `${USER_ENDPOINTS.ADMIN_UPDATE_NOTIFICATION}/${id}`,
    data,
    getAuthHeader()
  );
  return response.data;
};

export const deleteNotificationService = async (id) => {
  const response = await axios.delete(
    `${USER_ENDPOINTS.ADMIN_DELETE_NOTIFICATION}/${id}`,
    getAuthHeader()
  );
  return response.data;
};



// STUDENT GET PUSH NOTIFICATION FROM ADMIN
export const getPushNotificationFromAdminService = async () => {
  const response = await axios.get(
    USER_ENDPOINTS.STUDENT_PUSH_NOTIFICATION,
    getAuthHeader(),
  );
  return response.data;
}