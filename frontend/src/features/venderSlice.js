import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { changePasswordVendorService, getNotificationVendorService, getVendorDashboardService, getVendorOwnProfileService, updateProfileByVendorService } from "../auth/authServices";



// GET VENDOR PROFILE

export const getVendorProfile = createAsyncThunk(
    'vendor/getProfile',
    async(_, thunkAPI)=>{
        try {
            const response = await getVendorOwnProfileService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get Profile");
        }
    }
);

// UPDATE PROFILE THUNK
export const updateProfileByVendor = createAsyncThunk(
    'vendor/updateProfile',
    async(data, thunkAPI)=>{
        try {
            const response = await updateProfileByVendorService(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update profile");
        }
    }
);

// CHNAGE PASSWORD
export const changeVendorPassword = createAsyncThunk(
    'vendor/changePassword',
    async (data, thunkAPI) => {
        try {
            const response = await changePasswordVendorService(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to change password");            
        }
    }
);

// get Notification thunk

export const getNotificationVendor = createAsyncThunk(
    'vendor/getNotification',
    async(_, thunkAPI)=>{
        try {
            const response = await getNotificationVendorService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get Notifications");            
        }
    }
);

// VENDOR DASHBOARD
export const getVendorDashBoard = createAsyncThunk(
    'vendor/vendorDashboard',
    async(_, thunkAPI)=>{
        try {
            const response = await getVendorDashboardService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get Dashboard Data");
        }
    }
) 



const vendorSlice = createSlice({
    name: "vendor",
    initialState: {
        vendorProfile: null,
        vendorDashBoard: null,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
        notifications: [],
        activities: [],
    },

    reducers: {
        reset: (state) => {
            state.vendorProfile= null;
            state.vendorDashBoard= null;
            state.isLoading= false;
            state.isError= false;
            state.isSuccess= false;
            state.message = "";
            state.notifications= [],
            state.activities= []
        },
    },

    extraReducers: (builder)=>{
        builder

        // get profile
        .addCase(getVendorProfile.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        })
        .addCase(getVendorProfile.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.vendorProfile = action.payload.data;
        })
        .addCase(getVendorProfile.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload || "Failed to get profile"
        })

        // update profile

        .addCase(updateProfileByVendor.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        })
        .addCase(updateProfileByVendor.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.vendorProfile = action.payload.data;
        })
        .addCase(updateProfileByVendor.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload || "Failed to Update Profile"
        })

        // chnage password

        .addCase(changeVendorPassword.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(changeVendorPassword.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
        
        })
        .addCase(changeVendorPassword.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload || "Failed to Chanage Password"
        })

        // get notification
              .addCase(getNotificationVendor.pending, (state) => {
                state.isLoading = true;
                state.isError = null;
              })
              .addCase(getNotificationVendor.fulfilled, (state, action) => {
                state.isLoading = false;
                state.notifications = action.payload.notifications || [];
                state.activities = action.payload.activities || [];
              })
              .addCase(getNotificationVendor.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = action.payload;
              })

              // get Dashboard Data

              .addCase(getVendorDashBoard.pending, (state)=>{
                state.isLoading =  true;
                state.isError = false;
                state.isSuccess = false;
              })
              .addCase(getVendorDashBoard.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.vendorDashBoard = action.payload.data;
              })
              .addCase(getVendorDashBoard.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
              })

    }

})

export default vendorSlice.reducer;