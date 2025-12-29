import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteFeedbackService, getFeedbackService } from "../auth/authServices";

const initialState = {
  allFeedbacks: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// get all feedbacks thunk

export const getAllFeedbacks = createAsyncThunk(
    'superadmin/getAllfeedbacks',
    async(_, thunkAPI) => {
        try {
            const response = await getFeedbackService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to Fetch FeedBacks");
        }
    }
);

// delete feedback thunk service
export const deleteFeedback = createAsyncThunk(
    'superadmin/deleteFeedback',
    async({id}, thunkAPI) =>{
        try {
            const response = await deleteFeedbackService(id);
            return { ...response, id };
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "FAiled to Delete Feedabck")
        }
    }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    reset: (state) => {
      (state.allFeedbacks = null), (state.isLoading = false);
      (state.isError = false), (state.isSuccess = false), (state.message = "");
    },
  },
  extraReducers: (builder) => {
    builder
    // get all feedback
    .addCase(getAllFeedbacks.pending, (state)=>{
        state.isLoading = true;
        state.isError = false;
    })
    .addCase(getAllFeedbacks.fulfilled, (state, action)=>{
        state.isLoading = false;
        state.isSuccess = true;
        state.total = action.payload.count; 
        state.allFeedbacks = action.payload.data;
    })
    .addCase(getAllFeedbacks.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
    })

    // delete feedback 
    .addCase(deleteFeedback.pending, (state)=>{
        state.isLoading = true;
        state.isError = false;
    })
    .addCase(deleteFeedback.fulfilled, (state, action)=>{
          const deletedId = action.payload.id;
        state.allFeedbacks = state.allFeedbacks.filter(
          (fb) => fb._id !== deletedId
        );
        state.message = action.payload.message || "Feedback deleted";
      })
    .addCase(deleteFeedback.rejected, (state, action)=>{
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
    })

  },
});

export const {reset} = feedbackSlice.actions;
export default feedbackSlice.reducer;
