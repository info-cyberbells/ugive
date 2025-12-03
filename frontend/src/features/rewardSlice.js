import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllRewardsService } from "../auth/authServices";


const initialState = {
    rewards : [],
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRewards: 1,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
   
}






// Get All rewards
export const getAllRewards = createAsyncThunk(
    "rewards/getAllRewards",
    async (_, thunkAPI) => {
        try {
            return await getAllRewardsService();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);





const rewardSlice = createSlice({
    name: "reward",
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
            
            //get all rewards
            .addCase(getAllRewards.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllRewards.fulfilled, (state, action) => {
                state.isLoading = false;
                state.rewards = action.payload.rewards;             
            })
            .addCase(getAllRewards.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

    }
})

export const { reset } = rewardSlice.actions;
export default rewardSlice.reducer;