import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { changeAdminPasswordService, getAdminDashboardDataService, getAdminNotificationsService, getAdminProfileService, sendFeedbackByAdminService, updateAdminProfileService } from "../auth/authServices";
import { Feedback } from "../../../backend/src/models/feedback.model";

const initialState= {
    adminProfile : null,
    adminDashboard: null,
    adminProfileError: null,
    isAdminLoading: false,
    isAdminError: false,
    isAdminSuccess: false,
    adminMessage: null,
    adminNotifications: null,
    adminActivities: null,
}

//  ADMIN GET PROFILE THUNK
export const getAdminProfile = createAsyncThunk(
    'admin/getProfile',
    async (_, thunkAPI) => {
        try {
            const response = await getAdminProfileService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch admin profile!!!");
        }
    }
)

// ADMIN UPDATE PROFILE

export const updateAdminProfile = createAsyncThunk(
    'admin/adminProfile',
    async( formData, {thunkAPI}) => {
        try {
            const response = await updateAdminProfileService(formData);
            return response.user;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

// GET ADMIN NOTIFICATIONS THUNK
export const getAdminNotifiactions = createAsyncThunk(
    'admin/getNotifications',
    async(_, thunkAPI)=>{
        try {
            const response = await getAdminNotificationsService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch admin notifications");
        }
    }
);

// SEND FEEDBACK BY ADMIN THUNK
export const sendFeedbackByAdmin = createAsyncThunk(
    'admin/sendFeedback',
    async(feedback, thunkAPI)=>{
        try {
            const response = await sendFeedbackByAdminService(feedback);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to send feedback');
        }
    }
);

// CHANGE ADMIN PASSWORD THUNK
export const changeAdminPassword = createAsyncThunk(
    'admin/changePassword',
    async(data, thunkAPI)=>{
        try {
            const response = await changeAdminPasswordService(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to change password");
        }
    }
)

// ADMIN DASHBOARD DATA
export const getAdminDashboardData = createAsyncThunk(
    'admin/getAdminDashboardData',
    async(_, thunkAPI)=>{
        try {
            const response = await getAdminDashboardDataService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get Data");
        }
    }
)

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        reset: (state) => {
      state.isAdminLoading = false;
      state.isAdminSuccess = false;
      state.isAdminError = false;
      state.adminMessage = "";
    },
    },

    extraReducers: (builder) => {
        builder
        
        // GET ADMIN PROFILE
        .addCase(getAdminProfile.pending, (state)=>{
            state.isAdminLoading = true;
            state.isAdminError = false;
            state.adminProfileError = null;
        })
        .addCase(getAdminProfile.fulfilled, (state, action)=>{
            state.isAdminLoading = false;
            state.isAdminError = false;
            state.isAdminSuccess =true;
            state.adminProfileError =  null;
            state.adminProfile = action.payload.user;
        })
        .addCase(getAdminProfile.rejected, (state, action) => {
            state.isAdminLoading = false;
            state.isAdminError = true;
            state.isAdminSuccess = false;
            state.adminProfileError = action.payload;
        })

        //  UPDATE ADMIN PROFILE
        .addCase(updateAdminProfile.pending, (state)=>{
            state.isAdminLoading = true;
            state.isAdminError = false;
            state.adminProfileError = null;
        })
        .addCase(updateAdminProfile.fulfilled, (state, action)=>{
            state.isAdminLoading = false;
            state.isAdminError = false;
            state.adminProfile = action.payload;
        })
        .addCase(updateAdminProfile.rejected, (state, action)=>{
            state.isAdminLoading = false;
            state.isAdminError = true;
            state.adminProfileError = action.payload;
        })

        // GET ADMIN NOTIFICATIONS
        .addCase(getAdminNotifiactions.pending, (state)=>{
            state.isAdminLoading = true;
            state.isAdminError = false;
        })        
        .addCase(getAdminNotifiactions.fulfilled, (state, action)=>{
            state.isAdminLoading = false;
            state.isAdminSuccess = true;
            state.adminNotifications = action.payload.notifications;
            state.adminActivities = action.payload.activities;
        })
        .addCase(getAdminNotifiactions.rejected, (state, action)=>{
            state.isAdminLoading = false;
            state.isAdminError = true;
            state.adminMessage = action.payload;
        })

        // SEND FEEDBACK BY ADMIN
        .addCase(sendFeedbackByAdmin.pending, (state)=>{
            state.isAdminLoading = true;
            state.isAdminError = false;
        })
        .addCase(sendFeedbackByAdmin.fulfilled, (state, action)=>{
            state.isAdminLoading = false;
            state.isAdminSuccess = true;
            state.adminMessage = action.payload.message || "Feedback sent successfully";
        })
        .addCase(sendFeedbackByAdmin.rejected, (state, action)=>{
            state.isAdminLoading = false;
            state.isAdminError = true;
            state.adminMessage = action.payload;
        })

        // CHANGED ADMIN PASSWORD
        .addCase(changeAdminPassword.pending, (state) => {
            state.isAdminLoading = true;
            state.isAdminError = false;
        })
        .addCase(changeAdminPassword.fulfilled, (state, action) => {
            state.isAdminLoading = false;
            state.isAdminSuccess = true;
            state.adminMessage = action.payload.message || "Password changed successfully";
        })
        .addCase(changeAdminPassword.rejected, (state, action) => {
            state.isAdminLoading = false;
            state.isAdminError = true;
            state.adminMessage = action.payload;
        })

        // ADMIN DASHBOARD DATA
        .addCase(getAdminDashboardData.pending, (state)=>{
            state.isAdminLoading = true;
            state.isAdminError = false;
        })
        .addCase(getAdminDashboardData.fulfilled, (state, action)=>{
            state.isAdminLoading = false;
            state.adminDashboard = action.payload.data;
        })
        .addCase(getAdminDashboardData.rejected, (state)=>{
            state.isAdminLoading = false;
            state.isAdminError = true;
        })
    }

})

export const {reset } = adminSlice.actions;
export default adminSlice.reducer;