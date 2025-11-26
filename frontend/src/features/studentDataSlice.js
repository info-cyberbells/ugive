import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {getAllStudentDataService } from "../auth/authServices";

const initialState = {
  studentData : [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};



//get all university data thunk

export const getAllStudentsData = createAsyncThunk(
  "students/getAllStudentsData",
  async(studentsData, thunkAPI)=>{
    try {
      const response = await getAllStudentDataService(studentsData);
    return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
)

const studentDataSlice = createSlice({
  name: "studentData",
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
     
    .addCase(getAllStudentsData.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getAllStudentsData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.studentData = action.payload.data;
      state.page = action.payload.page;
      state.limit = action.payload.limit;
      state.total = action.payload.total;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(getAllStudentsData.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    });


  },
});

export const { reset } = studentDataSlice.actions;
export default studentDataSlice.reducer;
