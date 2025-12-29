import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createAdminService, deleteAdminService, getAllAdminsBySuperAdminService, getSingleAdminService, updateAdminDetailsService } from "../auth/authServices";


// GET ALL ADMINS THUNK
export const getAllAdminsBySuperAdmin = createAsyncThunk(
  'superadmin/getallAdmin',
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await getAllAdminsBySuperAdminService({ page, limit });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.messgae || "Failed to get all admins data")
    }
  }
);

// CREATE ADMIN THUNK
export const createAdminBySuperAdmin = createAsyncThunk(
  "superadmin/createAdmin",
  async (adminData, thunkAPI) => {
    try {
      const response = await createAdminService(adminData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create admin"
      );
    }
  }
);

// GET SINGLE ADMIN THUNK
export const getSingleAdminBySuperAdmin = createAsyncThunk(
  "superadmin/getSingleAdmin",
  async (adminId, thunkAPI) => {
    try {
      const response = await getSingleAdminService(adminId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin details"
      );
    }
  }
);


// DELETE ADMIN 
export const deleteAdminBySuperAdmin = createAsyncThunk(
  "superadmin/deleteAdmin",
  async (adminId, thunkAPI) => {
    try {
      const response = await deleteAdminService(adminId);
      return { adminId, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

// UPDATE ADMIN THUNK
export const updateAdminBySuperAdmin = createAsyncThunk(
  "superadmin/updateAdmin",
  async ({ id, payload }, thunkAPI) => {
    try {
      return await updateAdminDetailsService(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update admin"
      );
    }
  }
);




const superadminAdminSlice = createSlice({
  name: "superadminAdmins",
  initialState: {
    adminsList: [],
    rewards: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
    singleAdmin: null,
    isSingleLoading: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
  },

  reducers: {
    reset: (state) => {
      state.adminsList = [],
        state.page = 1,
        state.limit = 10,
        state.total = 0,
        state.totalPages = 1,
        state.isLoading = false,
        state.isError = false,
        state.isSuccess = false,
        state.message = ""
    }
  },

  extraReducers: (builder) => {
    builder

      // GET ALL ADMIN BUILDER
      .addCase(getAllAdminsBySuperAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAdminsBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminsList = action.payload.data;
        state.totalPages = action.payload.pagination.totalPages;
        state.limit = action.payload.pagination.limit;
        state.total = action.payload.pagination.total;
        state.page = action.payload.pagination.page;
      })
      .addCase(getAllAdminsBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.message;
      })

      // CREATE ADMIN BUILDER
      .addCase(createAdminBySuperAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createAdminBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminsList.unshift(action.payload.admin);
      })
      .addCase(createAdminBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // GET SINGLE ADMIN BUILDER
      .addCase(getSingleAdminBySuperAdmin.pending, (state) => {
        state.isSingleLoading = true;
        state.isError = false;
      })
      .addCase(getSingleAdminBySuperAdmin.fulfilled, (state, action) => {
        state.isSingleLoading = false;
        state.isSuccess = true;
        state.singleAdmin = action.payload.data;
      })
      .addCase(getSingleAdminBySuperAdmin.rejected, (state, action) => {
        state.isSingleLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      // UPDATE ADMIN DETAILS
      .addCase(updateAdminBySuperAdmin.pending, (state) => {
        state.isSingleLoading = true;
      })
      .addCase(updateAdminBySuperAdmin.fulfilled, (state) => {
        state.isSingleLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateAdminBySuperAdmin.rejected, (state, action) => {
        state.isSingleLoading = false;
        state.isError = true;
        state.message = action.payload;
      })


      // DELETE ADMIN BUILDER
      .addCase(deleteAdminBySuperAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteAdminBySuperAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminsList = state.adminsList.filter(
          (admin) => admin._id !== action.payload.adminId
        );
      })
      .addCase(deleteAdminBySuperAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })




  },
})

export const { reset } = superadminAdminSlice.actions;
export default superadminAdminSlice.reducer;