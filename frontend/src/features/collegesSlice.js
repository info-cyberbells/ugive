import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createCollegeService, deleteCollegeService, getAllCollegesDataService, getSingleCollegeService, updateCollegeService } from "../auth/authServices";

const initialState = {
  college: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  currentCollege: null,
};



//get all university data thunk

export const getCollegesData = createAsyncThunk(
  "college/getAllcollegesData",
  async(uniData, thunkAPI)=>{
    try {
      const response = await getAllCollegesDataService(uniData);
    return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
)

// create college thunk

export const createCollege = createAsyncThunk(
  "college/create",
  async (collegeData, thunkAPI) => {
    try {
      const response = await createCollegeService(collegeData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//singe college thunk
export const getSingleCollege = createAsyncThunk(
  "college/getSingle",
  async (id, thunkAPI) => {
    try {
      return await getSingleCollegeService(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// update college thunk

export const updateCollege = createAsyncThunk(
  "college/update",
  async ({ id, collegeData }, thunkAPI) => {
    try {
      const response = await updateCollegeService(id, collegeData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//delete college thunk
export const deleteCollege = createAsyncThunk(
  "college/delete",
  async (id, thunkAPI) => {
    try {
      return await deleteCollegeService(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const collegeSlice = createSlice({
  name: "college",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
     
      // get all university data
     
    .addCase(getCollegesData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getCollegesData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.college = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(getCollegesData.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    })

    // Create college
          .addCase(createCollege.pending, (state) => {
            state.isLoading = true;
          })
          .addCase(createCollege.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.college.push(action.payload);
          })
          .addCase(createCollege.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.message = action.payload;
          })

          //get single college
                .addCase(getSingleCollege.pending, (state) => {
                  state.isLoading = true;
                  state.isError = false;
                })
                .addCase(getSingleCollege.fulfilled, (state, action) => {
                  state.isLoading = false;
                  state.currentCollege = action.payload.data;
                  state.message = "College fetched successfully";
                })
                .addCase(getSingleCollege.rejected, (state, action) => {
                  state.isLoading = false;
                  state.isError = true;
                  state.message = action.payload;
                })

                // UPDATE College
                      .addCase(updateCollege.pending, (state) => {
                        state.isLoading = true;
                      })
                      .addCase(updateCollege.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isSuccess = true;
                        state.college = state.college.map((college) =>
                          college._id === action.payload._id ? action.payload : college
                        );
                      })
                      .addCase(updateCollege.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isError = true;
                        state.message = action.payload;
                      })

                
                      //delete college
                      .addCase(deleteCollege.pending, (state) => {
                        state.isLoading = true;
                        state.isError = false;
                      })
                      .addCase(deleteCollege.fulfilled, (state, action) => {
                        state.isLoading = false;
                        state.isSuccess = true;
                        state.college = state.college.filter(
                          (college) => college._id !== action.meta.arg
                        );
                
                        state.message = "College deleted successfully";
                      })
                      .addCase(deleteCollege.rejected, (state, action) => {
                        state.isLoading = false;
                        state.isError = true;
                        state.message = action.payload;
                      });

  },
});

export const { reset } = collegeSlice.actions;
export default collegeSlice.reducer;
