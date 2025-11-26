import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCollegesDataService } from "../auth/authServices";

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
    });


  },
});

export const { reset } = collegeSlice.actions;
export default collegeSlice.reducer;
