import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllRewardsService, createRewardService, deleteRewardService, getSingleRewardService, updateRewardService } from "../auth/authServices";


const initialState = {
    rewards: [],
    selectedReward: null,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRewards: 1,
    tableLoading: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",

}

// Get All rewards
export const getAllRewards = createAsyncThunk(
    "rewards/getAllRewards",
    async (query, thunkAPI) => {
        try {
            return await getAllRewardsService(query);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


//create  a reward
export const createReward = createAsyncThunk(
    "reward/create",
    async (formData, thunkAPI) => {
        try {
            return await createRewardService(formData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create reward");
        }
    }
);

//get single reward
export const getSingleReward = createAsyncThunk(
    "reward/getSingle",
    async (id, thunkAPI) => {
        try {
            return await getSingleRewardService(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch reward"
            );
        }
    }
);

//update reward
export const updateReward = createAsyncThunk(
    "reward/update",
    async ({ id, formData }, thunkAPI) => {
        try {
            return await updateRewardService(id, formData);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update reward"
            );
        }
    }
);

//delete reward thunk

export const deleteReward = createAsyncThunk(
    'reward/deleteReward',
    async (id, thunkAPI) => {
        try {
            return await deleteRewardService(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)




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
                state.tableLoading = true;
            })
            .addCase(getAllRewards.fulfilled, (state, action) => {
                state.tableLoading = false;
                state.rewards = action.payload.rewards;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
                state.totalPages = action.payload.totalPages;
                state.totalRewards = action.payload.totalRewards;
            })
            .addCase(getAllRewards.rejected, (state, action) => {
                state.tableLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // CREATE
            .addCase(createReward.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createReward.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Reward added successfully!";
            })
            .addCase(createReward.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // get Single reward builder
            .addCase(getSingleReward.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSingleReward.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedReward = action.payload.reward;
            })
            .addCase(getSingleReward.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // update reward
            .addCase(updateReward.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateReward.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Reward updated successfully!";
            })
            .addCase(updateReward.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // delete reward builder
            .addCase(deleteReward.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(deleteReward.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.rewards = state.rewards.filter(
                    (reward) => reward.id !== action.meta.arg
                )
                state.message = "Reward Deleted Successfully"
            })
            .addCase(deleteReward.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.message = action.payload;
            })
    }
})

export const { reset } = rewardSlice.actions;
export default rewardSlice.reducer;