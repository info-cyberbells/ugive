import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createVendorBySuperAdminService, deleteVendorBySuperAdminService, getAllVendorsSuperadminService, updateVendorsProfileBySuperAdminService, viewVendorProfileBySuperAdmin, getVendorRewardsBySuperAdminService, auditVendorRewardBySuperAdminService, createRewardBySuperAdminService, deleterewardBySuperAdminService } from "../auth/authServices";


// GET ALL VENDORS THUNK 
export const getAllVendorsBySuperAdmin = createAsyncThunk(
  'superadminVendors/getAllVendors',
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await getAllVendorsSuperadminService({ page, limit });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to Load Vendors Data");
    }
  }
);

// CRETAE VENDOR THUNK
export const createVendorBySuperAdmin = createAsyncThunk(
  'superadminVendors/createVendor',
  async (details, thunkAPI) => {
    try {
      const response = await createVendorBySuperAdminService(details);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create message");
    }
  }
);

// VIEW VENDORS PROFILE
export const getSingleVendorBySuperAdmin = createAsyncThunk(
  "superadminVendors/getSingleVendor",
  async (id, thunkAPI) => {
    try {
      return await viewVendorProfileBySuperAdmin(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor profile"
      );
    }
  }
);

// UPDATE VENDOR THUNK 
export const updateVendorBySuperAdmin = createAsyncThunk(
  "superadminVendors/updateVendor",
  async ({ id, payload }, thunkAPI) => {
    try {
      return await updateVendorsProfileBySuperAdminService(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update vendor"
      );
    }
  }
);

// DELETE VENDOR BY SUPER ADMIN
export const deleteVendorBySuperAdmin = createAsyncThunk(
  "superadminVendors/deleteVendor",
  async (id, thunkAPI) => {
    try {
      await deleteVendorBySuperAdminService(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete vendor"
      );
    }
  }
);


// GET vendor  rewards
export const getVendorRewardsBySuperAdmin = createAsyncThunk(
  "vendorRewards/getAll",
  async (params, thunkAPI) => {
    try {
      return await getVendorRewardsBySuperAdminService(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch vendor rewards"
      );
    }
  }
);

// PUT audit rewards
export const auditVendorRewardBySuperAdmin = createAsyncThunk(
  "vendorRewards/audit",
  async ({ id, data }, thunkAPI) => {
    try {
      return await auditVendorRewardBySuperAdminService(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update vendor reward"
      );
    }
  }
);

// Async Thunks
export const createRewardBySuperAdmin = createAsyncThunk(
  "superadminRewards/createReward",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await createRewardBySuperAdminService(formData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create reward"
      );
    }
  }
);

export const deleteRewardBySuperAdmin = createAsyncThunk(
  "superadminRewards/deleteReward",
  async (rewardId, { rejectWithValue }) => {
    try {
      const response = await deleterewardBySuperAdminService(rewardId);
      return { rewardId, response };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete reward"
      );
    }
  }
);




const superadminVendorsSlice = createSlice({
  name: "superadminVendors",
  initialState: {
    vendorsList: [],
    singleVendor: null,
    isSingleLoading: false,
    isSingleError: false,
    page: 1,
    limit: 10,
    totalVendors: 0,
    totalPages: 1,
    rewards: [],
    totalRewards: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    isCreating: false,
    createSuccess: false,
    createError: null,
    isDeleting: false,
    deleteSuccess: false,
    deleteError: null,
  },
  reducers: {
    reset: (state) => {
      state.vendorsList = [];
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
    },
    resetCreateRewardState: (state) => {
      state.isCreating = false;
      state.createSuccess = false;
      state.createError = null;
    },
    resetDeleteRewardState: (state) => {
      state.isDeleting = false;
      state.deleteSuccess = false;
      state.deleteError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Get All Vendors
      .addCase(getAllVendorsBySuperAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllVendorsBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.vendorsList = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalVendors = action.payload.total;
      })
      .addCase(getAllVendorsBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // create vendor
      .addCase(createVendorBySuperAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(createVendorBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.totalVendors += 1;
        if (state.vendorsList.length < state.limit) {
          state.vendorsList.unshift(action.payload.data);
        }
      })
      .addCase(createVendorBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      // view vendor profile
      .addCase(getSingleVendorBySuperAdmin.pending, (state) => {
        state.isSingleLoading = true;
        state.isSingleError = false;
        state.isSuccess = false;
      })
      .addCase(getSingleVendorBySuperAdmin.fulfilled, (state, action) => {
        state.isSingleLoading = false;
        state.singleVendor = action.payload.data;
      })
      .addCase(getSingleVendorBySuperAdmin.rejected, (state) => {
        state.isSingleLoading = false;
        state.isSingleError = true;
      })

      // update vendor
      .addCase(updateVendorBySuperAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })

      .addCase(updateVendorBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const updatedVendor = action.payload.data;

        state.vendorsList = state.vendorsList.map((vendor) =>
          vendor._id === updatedVendor._id ? updatedVendor : vendor
        );

        state.singleVendor = updatedVendor;
      })

      .addCase(updateVendorBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // DELETE VENDOR

      .addCase(deleteVendorBySuperAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(deleteVendorBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.vendorsList = state.vendorsList.filter(
          (vendor) => vendor._id !== action.payload
        );

        state.totalVendors = Math.max(state.totalVendors - 1, 0);
      })
      .addCase(deleteVendorBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      // GET
      .addCase(getVendorRewardsBySuperAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getVendorRewardsBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.rewards = action.payload.data || [];
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
        state.totalRewards = action.payload.total;
      })

      .addCase(getVendorRewardsBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // PUT
      .addCase(auditVendorRewardBySuperAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(auditVendorRewardBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const updatedReward = action.payload.data;

        state.rewards = state.rewards.map((reward) =>
          reward._id === updatedReward._id ? updatedReward : reward
        );
      })
      .addCase(auditVendorRewardBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //superadmin creating reward
      .addCase(createRewardBySuperAdmin.pending, (state) => {
        state.isCreating = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createRewardBySuperAdmin.fulfilled, (state, action) => {
        state.isCreating = false;
        state.createSuccess = true;
        state.createError = null;
      })
      .addCase(createRewardBySuperAdmin.rejected, (state, action) => {
        state.isCreating = false;
        state.createError = action.payload;
        state.createSuccess = false;
      })

      // Delete Reward
      .addCase(deleteRewardBySuperAdmin.pending, (state) => {
        state.isDeleting = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteRewardBySuperAdmin.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.deleteSuccess = true;
        state.deleteError = null;
      })
      .addCase(deleteRewardBySuperAdmin.rejected, (state, action) => {
        state.isDeleting = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      })





  }

})

export const { resetCreateRewardState, resetDeleteRewardState, } = superadminVendorsSlice.actions;
export default superadminVendorsSlice.reducer;