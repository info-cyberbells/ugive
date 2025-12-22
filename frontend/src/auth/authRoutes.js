export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const USER_ENDPOINTS = {
    LOGIN_USER: `${API_BASE_URL}/auth/login`,
    REGISTER_USER: `${API_BASE_URL}/auth/register`,
    PUBLIC_UNIVERSITIES: `${API_BASE_URL}/public/universities`,
    FORGOT_PASSWORD: `${API_BASE_URL}/public/request-reset-password`,
    RESET_PASSWORD: `${API_BASE_URL}/public/verify-reset-password`,

    GET_SOCIAL_LINKS: `${API_BASE_URL}/public/get-all-social-links`,
    ADD_SOCIAL_LINKS: `${API_BASE_URL}/public/create-social-link`,
    UPDATE_SOCIAL_LINKS: `${API_BASE_URL}/public/update-link`,
    DELETE_SOCIAL_LINKS: `${API_BASE_URL}/public/delete-link`,



    SUPERADMIN_GET_PROFILE: `${API_BASE_URL}/super_admin/profile`,
    SUPERADMIN_UPDATE_PROFILE: `${API_BASE_URL}/super_admin/profile`,
    SUPERADMIN_CHANGE_PASSWORD: `${API_BASE_URL}/super_admin/change-password`,

    SUPERADMIN_DASHBAORD: `${API_BASE_URL}/super_admin/dashboard`,

    SUPERADMIN_ADD_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,
    SUPERADMIN_UPDATE_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,
    SUPERADMIN_GET_ALL_UNIVERSITY: `${API_BASE_URL}/super_admin/get-all-universities`,
    SUPERADMIN_GET_SINGLE_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,
    SUPERADMIN_DELETE_UNIVERSITY: `${API_BASE_URL}/super_admin/universities`,
    GET_SUPERADMIN_NOTIFICATIONS: `${API_BASE_URL}/super_admin/notifications-and-activities`,




    SUPERADMIN_GET_ALL_COLLEGES: `${API_BASE_URL}/super_admin/get-all-colleges`,
    SUPERADMIN_ADD_COLLEGE: `${API_BASE_URL}/super_admin/colleges`,
    SUPERADMIN_GET_SINGLE_COLLEGE: `${API_BASE_URL}/super_admin/colleges`,
    SUPERADMIN_UPDATE_COLLEGE: `${API_BASE_URL}/super_admin/colleges`,
    SUPERADMIN_DELETE_COLLEGE: `${API_BASE_URL}/super_admin/colleges`,
    
    
    SUPERADMIN_GET_ADMINS: `${API_BASE_URL}/super_admin/admins`,
    SUPERADMIN_CREATE_ADMIN: `${API_BASE_URL}/super_admin/create-admin`,
    SUPERADMIN_VIEW_ADMIN: `${API_BASE_URL}/super_admin/admins`,
    SUPERADMIN_UPDATE_ADMIN: `${API_BASE_URL}/super_admin/admins`,
    SUPERADMIN_DELETE_ADMIN: `${API_BASE_URL}/super_admin/admins`,


    SUPERADMIN_GET_ALL_STUDENTS: `${API_BASE_URL}/super_admin/get-all-students`,
    SUPERADMIN_GET_SINGLE_STUDENT: `${API_BASE_URL}/super_admin/students`,
    SUPERADMIN_ADD_STUDENT: `${API_BASE_URL}/super_admin/create-student`,
    SUPERADMIN_UPDATE_STUDENT: `${API_BASE_URL}/super_admin/update-students`,
    SUPERADMIN_DELETE_STUDENT: `${API_BASE_URL}/super_admin/delete-students`,



    SUPERADMIN_GET_ALL_VENDORS: `${API_BASE_URL}/super_admin/vendors`,
    SUPERADMIN_CREATE_VENDOR: `${API_BASE_URL}/super_admin/create-vendor`,
    SUPERADMIN_GET_SINGLE_VENDOR: `${API_BASE_URL}/super_admin/vendors`,
    SUPERADMIN_UPDATE_VENDOR: `${API_BASE_URL}/super_admin/update-vendor`,
    SUPERADMIN_DELETE_VENDOR: `${API_BASE_URL}/super_admin/delete-vendor`,


    SUPERADMIN_GET_ALL_REWARDS: `${API_BASE_URL}/super_admin/get-all-rewards`,
    SUPERADMIN_ADD_REWARD: `${API_BASE_URL}/super_admin/create-reward`,
    SUPERADMIN_DELETE_REWARD: `${API_BASE_URL}/super_admin/delete-reward`,
    SUPERADMIN_GET_SINGLE_REWARD: `${API_BASE_URL}/super_admin/get-reward`,
    SUPERADMIN_UPDATE_REWARD: `${API_BASE_URL}/super_admin/update-reward`,

    SUPERADMIN_GET_ALL_FEEDBACKS: `${API_BASE_URL}/super_admin/get-all-feedback`,
    SUPERADMIN_DELETE_FEEDBACK: `${API_BASE_URL}/super_admin/delete-feedback`,






    //student endpoints
    STUDENT_DASHBOARD: `${API_BASE_URL}/student/student-dashboard`,
    STUDENT_GET_PROFILE: `${API_BASE_URL}/student/profile`,
    STUDENT_UPDATE_PROFILE: `${API_BASE_URL}/student/profile`,
    STUDENT_CHANGE_PASSWORD: `${API_BASE_URL}/student/change-password`,
    STUDENT_SEND_CARD: `${API_BASE_URL}/student/cards`,
    STUDENT_REWARDS_CLAIM: `${API_BASE_URL}/student/rewards/claim`,
    STUDENT_STREAK_SUMMARY: `${API_BASE_URL}/student/streak-summary`,
    STUDENT_REMAINING_CARD: `${API_BASE_URL}/student/remaining-cards`,

    STUDENT_DELETE_ACCOUNT: `${API_BASE_URL}/student/delete-account`,
    STUDENT_SEND_FEEDBACK: `${API_BASE_URL}/student/sent-feedback`,


    //get rewards for student college
    GET_ALL_REWARDS: `${API_BASE_URL}/student/college-rewards`,
    CHECK_CARD_ELIGIBILITY: `${API_BASE_URL}/student/check-card-eligibility`,
    GET_SENT_CARDS_LISTING: `${API_BASE_URL}/student/sent-card-listing`,


    SEARCH_USERS: `${API_BASE_URL}/search`,
    GET_FRIENDS_LIST: `${API_BASE_URL}/student/friends`,
    SEND_FRIEND_REQUEST: `${API_BASE_URL}/student/friend/send`,
    ACCEPT_FRIEND_REQUEST: `${API_BASE_URL}/student/friend/accept`,
    DELETE_FRIEND_REQUEST: `${API_BASE_URL}/student/friend/delete`,
    UNFRIEND: `${API_BASE_URL}/student/friend/unfriend`,
    GET_SENT_REQUESTS: `${API_BASE_URL}/student/friend/sent`,
    GET_RECEIVED_REQUESTS: `${API_BASE_URL}/student/friend/received`,

    GET_STUDENT_NOTIFICATIONS: `${API_BASE_URL}/student/get-my-notifications`,


    // ADMIN ROUTES
    ADMIN_GET_PROFILE: `${API_BASE_URL}/admin/profile`,
    ADMIN_UPDATE_PROFILE: `${API_BASE_URL}/admin/profile`,
    ADMIN_CHANGE_PASSWORD: `${API_BASE_URL}/admin/change-password`,

    ADMIN_DASHBOARD_DATA: `${API_BASE_URL}/admin/dashboard`,

    ADMIN_GET_ALL_COLLEGES : `${API_BASE_URL}/admin/colleges`,
    ADMIN_GET_SINGLE_UNIVERSITY : `${API_BASE_URL}/admin/universities`,
    ADMIN_ADD_COLLEGE : `${API_BASE_URL}/admin/colleges`,
    ADMIN_VIEW_SINGLE_COLLEGE : `${API_BASE_URL}/admin/colleges`,
    ADMIN_UPDATE_COLLEGE : `${API_BASE_URL}/admin/colleges`,
    ADMIN_DELETE_COLLEGE : `${API_BASE_URL}/admin/colleges`,


    ADMIN_GET_UNI_CARDS : `${API_BASE_URL}/admin/cards`,
    ADMIN_UPDATE_CARD_STATUS : `${API_BASE_URL}/admin/cards`,
    ADMIN_DELETE_CARD : `${API_BASE_URL}/admin/cards`,
    
    ADMIN_GET_ALL_STUDENTS : `${API_BASE_URL}/admin/students`,
    ADMIN_CREATE_STUDENT : `${API_BASE_URL}/admin/students`,
    ADMIN_GET_SINGLE_STUDENT : `${API_BASE_URL}/admin/students`,
    ADMIN_UPDATE_STUDENT : `${API_BASE_URL}/admin/students`,
    ADMIN_DELETE_STUDENT : `${API_BASE_URL}/admin/students`,

    ADMIN_GET_ALL_VENDORS : `${API_BASE_URL}/admin/vendors`,
    ADMIN_CREATE_VENDOR : `${API_BASE_URL}/admin/create-vendor`,
    ADMIN_GET_VENDOR : `${API_BASE_URL}/admin/vendors`,
    ADMIN_UPDATE_VENDOR : `${API_BASE_URL}/admin/update-vendor`,
    ADMIN_DELETE_VENDOR : `${API_BASE_URL}/admin/delete-vendor`,

    ADMIN_GET_ALL_REWARD : `${API_BASE_URL}/admin/rewards`,
    ADMIN_CREATE_REWARD : `${API_BASE_URL}/admin/create-reward`,
    ADMIN_VIEW_REWARD : `${API_BASE_URL}/admin/rewards`,
    ADMIN_UPDATE_REWARD : `${API_BASE_URL}/admin/update-rewards`,
    ADMIN_DELETE_REWARD : `${API_BASE_URL}/admin/delete-rewards`,

    ADMIN_GET_NOTIFICATIONS : `${API_BASE_URL}/admin/get-notifications`,
    ADMIN_SEND_FEEDBACK : `${API_BASE_URL}/admin/sent-feedback`,
    


};


export default USER_ENDPOINTS;