import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllStudentDataService,
  getSingleCollegeService,
  addCollegeService,
  updateCollegeService,
  deleteCollegeService,
} from "../auth/authServices";

const initialState = {
  studentData: [],
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
  async (studentsData, thunkAPI) => {
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


// Get single college
export const getSingleCollege = createAsyncThunk(
  "colleges/getSingleCollege",
  async (collegeId, thunkAPI) => {
    try {
      return await getSingleCollegeService(collegeId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add new college
export const addCollege = createAsyncThunk(
  "colleges/addCollege",
  async (data, thunkAPI) => {
    try {
      return await addCollegeService(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update college
export const updateCollege = createAsyncThunk(
  "colleges/updateCollege",
  async ({ collegeId, data }, thunkAPI) => {
    try {
      return await updateCollegeService({ collegeId, data });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete college
export const deleteCollege = createAsyncThunk(
  "colleges/deleteCollege",
  async (collegeId, thunkAPI) => {
    try {
      return await deleteCollegeService(collegeId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

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
      })

      /* ------- GET SINGLE COLLEGE ------- */
      .addCase(getSingleCollege.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleCollege.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleCollege = action.payload.data;
      })
      .addCase(getSingleCollege.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ------- ADD COLLEGE ------- */
      .addCase(addCollege.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCollege.fulfilled, (state, action) => {
        state.isLoading = false;
        state.colleges.push(action.payload.data);
        state.isSuccess = true;
      })
      .addCase(addCollege.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ------- UPDATE COLLEGE ------- */
      .addCase(updateCollege.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCollege.fulfilled, (state, action) => {
        state.isLoading = false;

        const updated = action.payload.data;
        state.colleges = state.colleges.map((c) =>
          c._id === updated._id ? updated : c
        );

        state.isSuccess = true;
      })
      .addCase(updateCollege.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ------- DELETE COLLEGE ------- */
      .addCase(deleteCollege.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCollege.fulfilled, (state, action) => {
        state.isLoading = false;
        const deletedId = action.meta.arg;
        state.colleges = state.colleges.filter((c) => c._id !== deletedId);
      })
      .addCase(deleteCollege.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });


  },
});

export const { reset } = studentDataSlice.actions;
export default studentDataSlice.reducer;
