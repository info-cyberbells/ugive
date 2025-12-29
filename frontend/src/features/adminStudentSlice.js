import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createStudentByAdminService, deleteStudentByAdminService, getAllStudentsForAdminService,  getSingleStudentDetailsByAdminService,
  updateStudentDetailsByAdminService,} from "../auth/authServices";



// ADMIN STUDENT SLICE
export const getAllStudentsAdmin = createAsyncThunk(
    'adminstudents/getAllStudentsAdmin',
    async ({page, limit}, thunkAPI) => {
        try {
            const response = await getAllStudentsForAdminService({page, limit});
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch students");
        }
    }
)

//ADMIN CREATE STUDENT THUNK

export const createStudentByAdmin = createAsyncThunk(
    'adminstudents/createStudentByAdmin',
    async (studentData, thunkAPI) =>{
        try {
            const response = await createStudentByAdminService(studentData);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create student");
        }
    }
);


// GET single student
export const getSingleStudentByAdmin = createAsyncThunk(
  "adminStudents/getSingle",
  async (studentId, thunkAPI) => {
    try {
      return await getSingleStudentDetailsByAdminService(studentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch student details"
      );
    }
  }
);

// UPDATE student
export const updateStudentByAdmin = createAsyncThunk(
  "adminStudents/update",
  async ({ studentId, studentData }, thunkAPI) => {
    try {
      return await updateStudentDetailsByAdminService({
        studentId,
        studentData,
      });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update student"
      );
    }
  }
);

// DELETE student by admin
export const deleteStudentByAdmin = createAsyncThunk(
  "adminstudents/delete",
  async (studentId, thunkAPI) => {
    try {
      return await deleteStudentByAdminService(studentId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete student"
      );
    }
  }
);


const adminStudentSlice = createSlice({
    name: "adminStudents",
    initialState:{
        studentList: [],
        studentDetails: null,
        page: 1,
        limit: 10,
        totalStudents: 0,
        totalPages: 1,
        count: 0,
        isLoading: false,
        isSingleLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },
    reducers:{
        reset: (state)=>{
            state.studentList = [];
            state.totalStudents = 0;
            state.page = 1;
            state.totalPages = 1;
            state.limit = 10;
            state.count = 0;
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
        resetStudentDetails: (state) => {
        state.studentDetails = null;
        }

    },
    extraReducers: (builder)=>{
        builder

        // get all students for admin
        .addCase(getAllStudentsAdmin.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.message = "";
        })
        .addCase(getAllStudentsAdmin.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = "";
            state.studentList = action.payload.data; 
            state.totalStudents = action.payload.total; 
            state.page = action.payload.page;           
            state.totalPages = action.payload.totalPages;
            state.limit = action.payload.limit;
            state.count = action.payload.count;
        })
        .addCase(getAllStudentsAdmin.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload; 
        })
        // create studnet by admin
        .addCase(createStudentByAdmin.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
        })
        .addCase(createStudentByAdmin.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.studentList.unshift(action.payload.data);
            state.totalStudents += 1;
        })
        .addCase(createStudentByAdmin.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload; 
        })

        // GET SINGLE STUDENT BY ADMIN
            .addCase(getSingleStudentByAdmin.pending, (state) => {
            state.isSingleLoading = true;
            state.isError = false;
            })
            .addCase(getSingleStudentByAdmin.fulfilled, (state, action) => {
            state.isSingleLoading = false;
            state.isSuccess = true;
            state.studentDetails = action.payload.data;
            })
            .addCase(getSingleStudentByAdmin.rejected, (state, action) => {
            state.isSingleLoading = false;
            state.isError = true;
            state.message = action.payload;
            })

            // UPDATE STUDENT BY ADMIN
            .addCase(updateStudentByAdmin.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            })
            .addCase(updateStudentByAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            // update list if exists
            const index = state.studentList.findIndex(
                (s) => s._id === action.payload.data._id
            );
            if (index !== -1) {
                state.studentList[index] = action.payload.data;
            }

            state.studentDetails = action.payload.data;
            })
            .addCase(updateStudentByAdmin.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
            })
            // DELETE STUDENT BY ADMIN
                .addCase(deleteStudentByAdmin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                })
                .addCase(deleteStudentByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                state.studentList = state.studentList.filter(
                    (s) => s._id !== action.meta.arg
                );

                state.totalStudents -= 1;
                })
                .addCase(deleteStudentByAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                })


    }
}) 

export const {reset, resetStudentDetails} =  adminStudentSlice.actions;
export default adminStudentSlice.reducer;