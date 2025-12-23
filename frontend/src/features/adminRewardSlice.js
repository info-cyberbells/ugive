import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createRewardByAdminService, getAllRewardsByAdminService, viewSingleRewardByAdminService, updateRewardByAdminService, deleteRewardByAdminService, } from "../auth/authServices";


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
    async ({ page, limit }, thunkAPI) => {
        try {
            const response = await getAllRewardsByAdminService({ page, limit });
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get rewards");
        }
    }
);

// CREATE REWARD BY AMDIN
export const createRewardByAdmin = createAsyncThunk(
    'adminreward/createReward',
    async (payload, thunkAPI) => {
        try {
            const response = await createRewardByAdminService(payload);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create admin");
        }
    }
)

export const viewRewardByAdmin = createAsyncThunk(
    "reward/viewRewardByAdmin",
    async (id, thunkAPI) => {
        try {
            return await viewSingleRewardByAdminService(id);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch reward"
            );
        }
    }
);



export const updateRewardByAdmin = createAsyncThunk(
    "reward/updateRewardByAdmin",
    async ({ id, formData }, thunkAPI) => { 
        try {
            return await updateRewardByAdminService({ id, formData }); 
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update reward"
            );
        }
    }
);

export const deleteRewardByAdmin = createAsyncThunk(
    "reward/deleteRewardByAdmin",
    async (id, thunkAPI) => {
        try {
            await deleteRewardByAdminService(id);
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete reward"
            );
        }
    }
);


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
            .addCase(getAllRewardsByAdmin.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
            })
            .addCase(getAllRewardsByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.adminRewards = action.payload.rewards;
                state.limit = action.payload.limit;
                state.totalPages = action.payload.totalPages;
                state.page = action.payload.page;
                state.totalRewards = action.payload.totalRewards;
            })
            .addCase(getAllRewardsByAdmin.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            })

            // create reward

            .addCase(createRewardByAdmin.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(createRewardByAdmin.fulfilled, (state, action) => {
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
            .addCase(createRewardByAdmin.rejected, (state) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            })

            // ================= VIEW REWARD =================
            .addCase(viewRewardByAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(viewRewardByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedReward = action.payload.reward;
            })
            .addCase(viewRewardByAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // ================= UPDATE REWARD =================
            .addCase(updateRewardByAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateRewardByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;

                const updated = action.payload.reward;
                state.adminRewards = state.adminRewards.map((r) =>
                    r._id === updated._id ? updated : r
                );

                state.selectedReward = updated;
            })
            .addCase(updateRewardByAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // ================= DELETE REWARD =================
            .addCase(deleteRewardByAdmin.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteRewardByAdmin.fulfilled, (state, action) => {
                state.isLoading = false;

                const deletedId = action.payload;

                state.adminRewards = state.adminRewards.filter(
                    (r) => r._id !== deletedId
                );

                state.totalRewards -= 1;
            })
            .addCase(deleteRewardByAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });




    }
})

export const { reset } = adminRewardSlice.actions;
export default adminRewardSlice.reducer;