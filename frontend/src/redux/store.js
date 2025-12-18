import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/studentSlice"
import universityReducer from "../features/universitySlice"
import superadminReducer from "../features/superadminProfileSlice"
import collegeReducer from "../features/collegesSlice"
import studentDataReducer from "../features/studentDataSlice"
import rewardReducer from "../features/rewardSlice"
import studentRewardReducer from "../features/studentRewardsSlice";
import studentCardReducer from "../features/studentCardSlice"
import friendsReducer from '../features/friendsSlice';
import feedbackReducer from '../features/feedbackSlice';
import adminReducer from '../features/adminSlice';
import adminCollegesReducer from '../features/adminCollegesSlice'
import adminCardReducer from "../features/adminCardSlice"
import adminStudentsReducer from '../features/adminStudentSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        university: universityReducer,
        superadmin: superadminReducer,
        college: collegeReducer,
        studentData: studentDataReducer,
        reward: rewardReducer,
        studentReward: studentRewardReducer,
        studentCard: studentCardReducer,
        friends: friendsReducer,
        feedback: feedbackReducer,
        admin: adminReducer,
        adminColleges: adminCollegesReducer,
        adminCard:  adminCardReducer,
        adminStudents: adminStudentsReducer,
    }
})

export default store;