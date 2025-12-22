import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createRewardByAdminService, getAllRewardsByAdminService } from "../auth/authServices";
import axios from "axios";


const initialState = {
    adminRewards: [],
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRewards: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
}

// GET ALL REWARD THUNK
export const getAllRewardsByAdmin = createAsyncThunk(
    'adminreward/getAllRewards',
    async({page, limit}, thunkAPI) => {
        try {
            const response = await getAllRewardsByAdminService({page,limit});
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get rewards");
        }
    }
);

// CREATE REWARD BY AMDIN
export const createRewardByAdmin = createAsyncThunk(
    'adminreward/createReward',
    async(payload, thunkAPI) => {
        try {
            const response = await createRewardByAdminService(payload);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create admin");
        }
    }
)



const adminRewardSlice = createSlice({
    name: "adminReward",
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

        // get all rewards
        .addCase(getAllRewardsByAdmin.pending, (state)=>{
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
        })
        .addCase(getAllRewardsByAdmin.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.adminRewards = action.payload.rewards;
            state.limit = action.payload.limit;
            state.totalPages = action.payload.totalPages;
            state.page = action.payload.page;
            state.totalRewards = action.payload.totalRewards;
        })
        .addCase(getAllRewardsByAdmin.rejected, (state)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
        })

        // create reward

        .addCase(createRewardByAdmin.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
        })
        .addCase(createRewardByAdmin.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.totalRewards += 1;
            if (action.payload?.data && action.payload.data._id) {
                state.totalRewards += 1;

                if (state.adminRewards.length < state.limit) {
                state.adminRewards.unshift(action.payload.data);
                }
            }
        })
        .addCase(createRewardByAdmin.rejected, (state)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
        })



              }
})

export const { reset } = adminRewardSlice.actions;
export default adminRewardSlice.reducer;