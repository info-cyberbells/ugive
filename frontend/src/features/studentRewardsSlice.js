import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getStudentRewardsService } from "../auth/authServices";

export const getStudentRewards = createAsyncThunk(
    "reward/getStudentRewards",
    async (_, thunkAPI) => {
        try {
            return await getStudentRewardsService();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to load rewards"
            );
        }
    }
);

const rewardSlice = createSlice({
    name: "studentReward",
    initialState: {
        rewards: [],
        isLoading: false,
        isError: false,
        message: "",
    },
    reducers: {
        resetRewardsState: (state) => {
            state.rewards = [];
            state.isLoading = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStudentRewards.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStudentRewards.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rewards = action.payload.data;
            })
            .addCase(getStudentRewards.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetRewardsState } = rewardSlice.actions;
export default rewardSlice.reducer;
