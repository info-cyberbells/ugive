import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createUniversityService,
  updateUniversityService,
} from "../auth/authServices";

const initialState = {
  university: [],
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
      });
  },
});

export const { reset } = universitySlice.actions;
export default universitySlice.reducer;
