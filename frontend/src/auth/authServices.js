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
    const response = await axios.get(
        USER_ENDPOINTS.GET_SOCIAL_LINKS
    );
    return response.data;
}

// add social links
export const addSocialLinkService = async (formData) => {
    const response = await axios.post(
        USER_ENDPOINTS.ADD_SOCIAL_LINKS,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
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


// get all rewards
export const getAllRewardsService = async (query) => {
    const response = await axios.get(USER_ENDPOINTS.SUPERADMIN_GET_ALL_REWARDS,
        {
            params: query,
            ...getAuthHeader(),
        }
    );
    return response.data;
}

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
        getAuthHeader(),
    )
    return response.data;
}

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
        getAuthHeader(),
    );
    return response.data;
}

// delete feedback

export const deleteFeedbackService = async (id) => {
    const response = await axios.delete(
        `${USER_ENDPOINTS.SUPERADMIN_DELETE_FEEDBACK}/${id}`,
        getAuthHeader(),
    );
    return response.data;
}














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
        getAuthHeader(),
    )
    return response.data;
}


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
    const response = await axios.get(USER_ENDPOINTS.GET_SENT_CARDS_LISTING,
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
}

// SEND FEEDBACK BY STUDENT SERVICE 
export const sendFeedbackStudentService = async (feedback) => {
    const response = await axios.post(
        USER_ENDPOINTS.STUDENT_SEND_FEEDBACK,
        {feedback},
        getAuthHeader()
    )
    return response.data;
}

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
export const searchUsersService = async (name, email) => {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (email) params.append('email', email);

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
        getAuthHeader(),
    )
    return response.data;
}

//  GET REMIANING CARDS PROGRESS
export const getRemainingCardService = async () => {
    const response = await axios.get(
        USER_ENDPOINTS.STUDENT_REMAINING_CARD,
        getAuthHeader(),
    );
    return response.data;
}
