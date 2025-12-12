import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  changeSuperAdminPasswordService,
  getSuperAdminProfileService,
  updateSuperAdminProfileService,
  getSuperAdminDashboardService,
  getSuperAdminNotificationsService
} from '..//auth/authServices';


//fetch superadmin profile
export const fetchSuperAdminProfile = createAsyncThunk(
  'superadmin/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSuperAdminProfileService();
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch profile'
      );
    }
  }
);

// update superAdmin profie thunk

export const updateSuperAdminProfile = createAsyncThunk(
  "superAdmin/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateSuperAdminProfileService(formData);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

// change super admin password thunk
export const changeSuperAdminPassword = createAsyncThunk(
  "superadmin/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      return await changeSuperAdminPasswordService(passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password update failed"
      );
    }
  }
);


export const getSuperAdminDashboard = createAsyncThunk(
  "superAdminDashboard/getData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSuperAdminDashboardService();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);


export const fetchSuperAdminNotifications = createAsyncThunk(
  "superAdminNotifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSuperAdminNotificationsService();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
    }
  }
);

const initialState = {
  profile: null,
  profileLoading: false,
  profileError: null,
  dashboardData: null,
  notifications: [],
  activities: [],

  universities: [],
  universitiesLoading: false,
  universitiesError: null,

  loading: false,
  error: null,
  success: false,
};

const superadminSlice = createSlice({
  name: 'superadmin',
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.profileError = null;
    },
    clearDashboardData: (state) => {
      state.dashboardData = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch superadmin profile
      .addCase(fetchSuperAdminProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchSuperAdminProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.profileError = null;
      })
      .addCase(fetchSuperAdminProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload;
      })

      // update superAdmin profile
      .addCase(updateSuperAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSuperAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.profile = action.payload;
      })
      .addCase(updateSuperAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // change password  builder
      .addCase(changeSuperAdminPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeSuperAdminPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeSuperAdminPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Super Admin Dashboard
      .addCase(getSuperAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSuperAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload.data;
      })
      .addCase(getSuperAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dashboard data";
      })

      //fetch superadmin notifications
      .addCase(fetchSuperAdminNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuperAdminNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications || [];
        state.activities = action.payload.activities || [];
      })
      .addCase(fetchSuperAdminNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


  },
});

export const { resetState, clearProfile } = superadminSlice.actions;
export default superadminSlice.reducer;