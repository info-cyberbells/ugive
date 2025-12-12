import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllStudentDataService,
  getSingleStudentService,
  createStudentService,
  updateStudentService,
  deleteStudentService,
  getStudentProfileService,
  updateStudentProfileService,
  changeStudentPasswordService,
  deleteStudentAccountService,
  sendFeedbackStudentService,
  getStreakSummaryService,
  getstudentDashboardService,
  getStudentNotificationsService,
} from "../auth/authServices";
import { Feedback } from "../../../backend/src/models/feedback.model";

const initialState = {
  studentData: [],
  page: 1,
  limit: 10,
  total: 0,
  singleStudent: null,
  totalPages: 1,
  notifications: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  studentProfile: null,
  streakSummary: null,
  studentDashboard: null,
  dasboardLoading: false,
};



//get all students data thunk
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


// Get single student data
export const getSingleStudent = createAsyncThunk(
  "students/getSingleStudent",
  async (studentId, thunkAPI) => {
    try {
      return await getSingleStudentService(studentId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Add new student 
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (data, thunkAPI) => {
    try {
      return await createStudentService(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Update student
export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ studentId, data }, thunkAPI) => {
    try {
      return await updateStudentService({ studentId, data });
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Delete student
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (studentId, thunkAPI) => {
    try {
      return await deleteStudentService(studentId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// get student profile detail on Student panel

export const fetchProfile = createAsyncThunk(
  'student/getProfile',
  async (_, thunkAPI) => {
    try {
      return await getStudentProfileService();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
);

export const updateStudentProfile = createAsyncThunk(
  "student/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await updateStudentProfileService(formData);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed"
      );
    }
  }
);

// student cahnge password thunk

export const changeStudentPassword = createAsyncThunk(
  "student/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      return await changeStudentPasswordService(passwordData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Password update failed"
      );
    }
  }
);

// DELETE STUDENT ACCOUNT

export const deleteStudentAccount = createAsyncThunk(
  'student/deleteAccount',
  async (_, thunkAPI) => {
    try {
      const response = await deleteStudentAccountService();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.message || 'Failed To delete the Account'
      )
    }
  }
);

// STUDENT FEEDBACK SERVICE

export const sendFeedbackStudent = createAsyncThunk(
  'student/sendfeedback',
  async (feedback, thunkAPI) => {
    try {
      const response = await sendFeedbackStudentService(feedback);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to send feedback"
      );
    }
  }
);

// student Streak Summary

export const getStreakSummary = createAsyncThunk(
  'student/streakSummary',
  async (_, thunkAPI) => {
    try {
      const response = await getStreakSummaryService();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch the data"
      );
    }
  }
);

// student dashboard thunk
export const getstudentDashboardData = createAsyncThunk(
  'student/studentDashboardData',
  async (_, thunkAPI) => {
    try {
      const response = await getstudentDashboardService();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch data");
    }
  }
);

export const fetchStudentNotifications = createAsyncThunk(
  "studentNotifications/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getStudentNotificationsService();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch notifications");
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
    resetStudentState: (state) => {
      state.studentDashboard = null;
      state.studentProfile = null;
      state.singleStudent = null;
      state.studentData = [];
      state.page = 1;
      state.limit = 10;
      state.total = 0;
      state.totalPages = 1;
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";

    },
  },
  extraReducers: (builder) => {
    builder

      // get all getAllStudentsData 
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

      /* ------- GET SINGLE studdent data ------- */
      .addCase(getSingleStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.singleStudent = action.payload.data;
      })
      .addCase(getSingleStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ------- ADD new student ------- */
      .addCase(addStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Student added successfully";
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ------- UPDATE student details ------- */
      .addCase(updateStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Student updated successfully";
        const updated = action.payload.data;
        state.studentData = state.studentData.map((student) =>
          student._id === updated._id ? updated : student
        );
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /* ------- DELETE student details ------- */
      .addCase(deleteStudent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Student deleted successfully";
        const deletedId = action.meta.arg;
        state.studentData = state.studentData.filter((student) => student._id !== deletedId);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // get student profile 
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.studentProfile = action.payload.user;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload.user;
        state.user = null;
      })

      // update profile student
      .addCase(updateStudentProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
        state.isSuccess = false;
      })
      .addCase(updateStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.studentProfile = action.payload;
      })
      .addCase(updateStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      // cahnge student password 
      .addCase(changeStudentPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(changeStudentPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changeStudentPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      })

      // delete student account

      .addCase(deleteStudentAccount.pending, (state) => {
        state.isLoading = true;
        state.isError = false;

      })
      .addCase(deleteStudentAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = "Account deleted successfully";
        state.studentProfile = null;
        state.singleStudent = null;
        state.studentData = [];
        state.user = null;
      })
      .addCase(deleteStudentAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //  SENT STUDENT FEEDBACK 
      .addCase(sendFeedbackStudent.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(sendFeedbackStudent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = action.payload.message;
      })
      .addCase(sendFeedbackStudent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      // get streak summary
      .addCase(getStreakSummary.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getStreakSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.streakSummary = action.payload.data;
      })
      .addCase(getStreakSummary.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })

      // student dashboard builder
      .addCase(getstudentDashboardData.pending, (state) => {
        state.dasboardLoading = true;
        state.isError = false;
      })
      .addCase(getstudentDashboardData.fulfilled, (state, action) => {
        state.dasboardLoading = false;
        state.isSuccess = true;
        state.studentDashboard = action.payload.data;
      })
      .addCase(getstudentDashboardData.rejected, (state, action) => {
        state.dasboardLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      .addCase(fetchStudentNotifications.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchStudentNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data || [];
      })
      .addCase(fetchStudentNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  },
});

export const { reset, resetStudentState } = studentDataSlice.actions;
export default studentDataSlice.reducer;
