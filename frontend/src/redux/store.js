import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/studentSlice"
import universityReducer from "../features/universitySlice"
import superadminReducer from "../features/superadminProfileSlice"
import collegeReducer from "../features/collegesSlice"
import studentDataReducer from "../features/studentDataSlice"
import rewardReducer from "../features/rewardSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        university: universityReducer,
        superadmin: superadminReducer,
        college: collegeReducer,
        studentData: studentDataReducer,
        reward : rewardReducer,
    }
})

export default store;