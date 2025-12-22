import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createVendorByAdminService, deleteVendorProfileByAdminService, getAllVendorsByAdminService, updateVendorProfileByAdminService, viewVendorProfileByAdminService } from "../auth/authServices";


// GET ALL VENDORS THUNK 
export const getAllVendorsByAdmin = createAsyncThunk(
    'adminVendors/getAllVendors',
    async({page, limit}, thunkAPI) =>{
        try {
            const response = await getAllVendorsByAdminService({page, limit});
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to Load Vendors Data");
        }
    }
);

// CRETAE VENDOR THUNK
export const createVendorByAdmin = createAsyncThunk(
    'adminVendors/createVendor',
    async(details, thunkAPI)=>{
        try {
            const response = await createVendorByAdminService(details);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create message");
        }
    }
);

// VIEW VENDORS PROFILE
export const getSingleVendorByAdmin = createAsyncThunk(
  "adminVendors/getSingleVendor",
  async (id, thunkAPI) => {
    try {
      return await viewVendorProfileByAdminService(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch vendor profile"
      );
    }
  }
);

// UPDATE VENDOR THUNK 
export const updateVendorByAdmin = createAsyncThunk(
  "superadminVendors/updateVendor",
  async ({ id, payload }, thunkAPI) => {
    try {
      return await updateVendorProfileByAdminService(id, payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update vendor"
      );
    }
  }
);

// DELETE VENDOR BY SUPER ADMIN
export const deleteVendorByAdmin = createAsyncThunk(
  "adminVendors/deleteVendor",
  async (id, thunkAPI) => {
    try {
      await deleteVendorProfileByAdminService(id);
      return id; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete vendor"
      );
    }
  }
);




const adminVendorsSlice = createSlice({
    name: "adminVendors",
    initialState: {
      vendorsList: [],
      singleVendor: null,
      isSingleLoading: false,
      isSingleError: false,
      page: 1,
      limit: 10,
      totalVendors: 0,
      totalPages: 1,
      isLoading: false,
      isError: false,
      isSuccess: false,
      message: "",
    },
    reducers: {
      reset: (state)=>{
        state.vendorsList = [];
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = false;
      },
    },

    extraReducers: (builder) => {
        builder

        // Get All Vendors
        .addCase(getAllVendorsByAdmin.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(getAllVendorsByAdmin.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.vendorsList = action.payload.data;
            state.page = action.payload.page;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
            state.totalVendors = action.payload.total;
        })
        .addCase(getAllVendorsByAdmin.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })

        // create vendor
       .addCase(createVendorByAdmin.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(createVendorByAdmin.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.totalVendors += 1;
            if (state.vendorsList.length < state.limit) {
                state.vendorsList.unshift(action.payload.data);
                }
        })
        .addCase(createVendorByAdmin.rejected, (state, action)=>{
                    state.isLoading = false;
                    state.isError = true;
        })

            // view vendor profile
            .addCase(getSingleVendorByAdmin.pending, (state) => {
                state.isSingleLoading = true;
                state.isSingleError = false;
                state.isSuccess = false;
            })
            .addCase(getSingleVendorByAdmin.fulfilled, (state, action) => {
                state.isSingleLoading = false;
                state.singleVendor = action.payload.data;
            })
            .addCase(getSingleVendorByAdmin.rejected, (state) => {
                state.isSingleLoading = false;
                state.isSingleError = true;
            })

            // update vendor
            .addCase(updateVendorByAdmin.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            })

            .addCase(updateVendorByAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            const updatedVendor = action.payload.data;

            state.vendorsList = state.vendorsList.map((vendor) =>
                vendor._id === updatedVendor._id ? updatedVendor : vendor
            );

            state.singleVendor = updatedVendor;
            })

            .addCase(updateVendorByAdmin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            })

        // DELETE VENDOR
        .addCase(deleteVendorByAdmin.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(deleteVendorByAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            state.vendorsList = state.vendorsList.filter(
                (vendor) => vendor._id !== action.payload
            );

            state.totalVendors = Math.max(state.totalVendors - 1, 0);
        })
        .addCase(deleteVendorByAdmin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })


        
    }

})


export default adminVendorsSlice.reducer;