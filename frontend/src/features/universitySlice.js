import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUniversityService,
  getAllUniversitiesDataService,
  updateUniversityService,
} from "../auth/authServices";

const initialState = {
  university: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Create University Thunk
export const createUniversity = createAsyncThunk(
  "university/create",
  async (uniData, thunkAPI) => {
    try {
      const response = await createUniversityService(uniData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// Upadte University thunk
export const updateUniversity = createAsyncThunk(
  "university/update",
  async ({ id, uniData }, thunkAPI) => {
    try {
      const response = await updateUniversityService(id, uniData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

//get all university data thunk

export const getUniversitiesData = createAsyncThunk(
  "university/getAllData",
  async(uniData, thunkAPI)=>{
    try {
      const response = await getAllUniversitiesDataService(uniData);
    return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
)

const universitySlice = createSlice({
  name: "university",
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
      // Create University
      .addCase(createUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.university.push(action.payload);
      })
      .addCase(createUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // UPDATE UNIVERSITY
      .addCase(updateUniversity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUniversity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.university = state.university.map((uni) =>
          uni._id === action.payload._id ? action.payload : uni
        );
      })
      .addCase(updateUniversity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // get all university data
     
    .addCase(getUniversitiesData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getUniversitiesData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.university = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(getUniversitiesData.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    });


  },
});

export const { reset } = universitySlice.actions;
export default universitySlice.reducer;
