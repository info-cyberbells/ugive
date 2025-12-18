import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addCollegeAdminService,
  deleteCollegeAdminService,
  getAdminCollegesService,
  getAllCollegesDataService,
  getSingleUniversityForAdminService,
  updateCollegeAdminService,
  viewSingleCollegeAdminService,
} from "../auth/authServices";
import { getSingleUniversity } from "./universitySlice";

const initialState = {
  adminColleges: [],
  isLoading: false,
   page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  isSingleLoading: false,
  isError: null,
  isSuccess: false,
  message: "",
  adminUni: "",
  adminAddCollege: null,
  singleCollege: null,
  updateCollege: null,
};

// get all colleges thunk

// export const getAdminColleges = createAsyncThunk(
//   "admin/getAllColleges",
//   async (_, thunkAPI) => {
//     try {
//       const response = await getAdminCollegesService();
//       return response;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || "Failed to fetch colleges"
//       );
//     }
//   }
// );

export const getAdminColleges = createAsyncThunk(
  "admin/getAllColleges",
  async ({ page, limit }, thunkAPI) => {
    try {
      const response = await getAdminCollegesService({ page, limit });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch colleges"
      );
    }
  }
);


// GET SINGLE UNIVERSITY THUNK

export const getSingleUniversityForAdmin = createAsyncThunk(
  "admin/getSinglrUniversity",
  async (id, thunkAPI) => {
    try {
      const response = await getSingleUniversityForAdminService(id);
      return response;
    } catch (error) {
      return (
        thunkAPI.rejectWithValue(error.response?.data?.message) ||
        "Failed to fetch university"
      );
    }
  }
);

// ADD COLLEGE BY ADMIN THUNK
export const addCollegeByAdmin = createAsyncThunk(
  "admin/addCollege",
  async (collegeData, thunkAPI) => {
    try {
      const response = await addCollegeAdminService(collegeData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to Add College"
      );
    }
  }
);

// VIEW SINGLE COLLEGE BY ADMIN THUNK
export const viewSingleCollegebyAdmin = createAsyncThunk(
  "admin/viewsingleCollege",
  async (id, thunkAPI) => {
    try {
      const response = await viewSingleCollegeAdminService(id);
      return response;
    } catch (error) {
      return (
        thunkAPI.rejectWithValue(error.response?.data?.message) ||
        "Failed to fetch college details"
      );
    }
  }
);

// UPDATE COLLEGE BY ADMIN THUNK
export const updateCollegeByAdmin = createAsyncThunk(
  "admin/updateCollege",
  async ({ id, collegeData }, thunkAPI) => {
    try {
      const response = await updateCollegeAdminService(id, collegeData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update college"
      );
    }
  }
);

// DELETE COLLEGE BY ADMIN THUNK

export const deleteCollegeByAdmin = createAsyncThunk(
    'admin/deleteCollege',
    async(id, thunkAPI) => {
        try {
            await deleteCollegeAdminService(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete college");
        }
    }
)







const adminCollegesSlice = createSlice({
  name: "adminColleges",
  initialState,
  reducers: {
    reset: (state) => {
      state.adminColleges = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
    resetSingleCollege: (state) => {
      state.singleCollege = null;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder

      //get all colleges
      .addCase(getAdminColleges.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAdminColleges.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminColleges = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getAdminColleges.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      // GET SINGLE UNIVERSITY FOR ADMIN
      .addCase(getSingleUniversityForAdmin.pending, (state) => {
        state.isSingleLoading = true;
        state.isError = false;
      })
      .addCase(getSingleUniversityForAdmin.fulfilled, (state, action) => {
        state.isSingleLoading = false;
        state.isSuccess = true;
        state.adminUni = action.payload.data;
      })
      .addCase(getSingleUniversityForAdmin.rejected, (state, action) => {
        state.isSingleLoading = false;
        state.isError = action.payload;
      })

      // add college by admin
      .addCase(addCollegeByAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(addCollegeByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminAddCollege = action.payload.data;
      })
      .addCase(addCollegeByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      // VIEW SINGLE COLLEGE BY ADMIN
      .addCase(viewSingleCollegebyAdmin.pending, (state) => {
        state.isSingleLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.singleCollege = null;
      })
      .addCase(viewSingleCollegebyAdmin.fulfilled, (state, action) => {
        state.isSingleLoading = false;
        state.isSuccess = true;
        state.singleCollege = action.payload.data;
      })
      .addCase(viewSingleCollegebyAdmin.rejected, (state, action) => {
        state.isSingleLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch college";
      })

      // UPADTE COLLEGE THUNK
      .addCase(updateCollegeByAdmin.pending, (state) => {
        state.isSingleLoading = true;
        state.isError = false;
      })
      .addCase(updateCollegeByAdmin.fulfilled, (state, action) => {
        state.isSingleLoading = false;
        state.isSuccess = true;
        state.updateCollege = action.payload.data;
        // Update the college in the adminColleges array
        const index = state.adminColleges.findIndex(
          (college) => college._id === action.payload.data._id
        );
        if (index !== -1) {
          state.adminColleges[index] = action.payload.data;
        }
      })
      .addCase(updateCollegeByAdmin.rejected, (state, action) => {
        state.isSingleLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to update college";
      })

      // delete college thunk
      .addCase(deleteCollegeByAdmin.pending, (state)=>{
        state.isLoading =  true;
        state.isError = false;
      })
      .addCase(deleteCollegeByAdmin.fulfilled, (state, action)=>{
        state.isLoading  = false;
        state.isSuccess = true;
        // Remove the deleted college from adminColleges array
        state.adminColleges = state.adminColleges.filter(
            (college) => college._id !== action.payload
        );
      })
      .addCase(deleteCollegeByAdmin.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to delete college";
      })
  },
});

export const { reset, resetSingleCollege } = adminCollegesSlice.actions;
export default adminCollegesSlice.reducer;
