import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/studentSlice"
import universityReducer from "../features/universitySlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        university: universityReducer,
    }
})

export default store;