import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createRewardByVendorService, deleterewardByVendorService, getAllRewardVendorService, updateRewardByVendorService, viewSingleRewardByVendorService } from "../auth/authServices";


const initialState = {
    VendorRewards: [],
    selectedReward: null,
    page: 1,
    limit: 10,
    totalPages: 1,
    totalRewards: 1,
    singleLoading: false,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",

}

// Get All rewards
export const getAllVendorRewards = createAsyncThunk(
    "rewards/getAllRewards",
    async ({limit, page}, thunkAPI) => {
        try {
            const response = await getAllRewardVendorService({limit, page});
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// CREATE REWARD BY VENDOR
export const createRewardByVendor = createAsyncThunk(
    'rewards/createReward',
    async(formData, thunkAPI)=>{
        try {
            const response = await createRewardByVendorService(formData);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create the Reward");
        }
    }
);

// VIEW REWARD BY VENDOR
export const viewRewardByVendor = createAsyncThunk(
    'rewards/viewReward',
    async (id, thunkAPI)=>{
        try {
            const response = await viewSingleRewardByVendorService(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to view reward");
        }
    }
);

// UPADTE REWARD BY VENDOR
export const updateRewardByVendor = createAsyncThunk(
    'rewards/updateReward',
    async({id, formData}, thunkAPI)=>{
        try {
            const response = await updateRewardByVendorService({id, formData});
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update the reward")
        }
    }
);

// DELETE REWARD BY VENDER THUNK
export const deleteRewardByVendor = createAsyncThunk(
    'rewards/deleteReward',
    async(id, thunkAPI)=>{
        try {
            const response = await deleterewardByVendorService(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete reward");
        }
    }
)




const vendorRewardSlice = createSlice({
    name: "vendorReward",
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
            .addCase(getAllVendorRewards.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
                state.message = '';
            })
            .addCase(getAllVendorRewards.fulfilled, (state, action) => {
                state.isLoading = false;
                state.VendorRewards = action.payload.data;
                state.page = action.payload.page;
                state.limit = action.payload.limit;
                state.totalPages = action.payload.totalPages;
                state.totalRewards = action.payload.total;
            })
            .addCase(getAllVendorRewards.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Create reward
            .addCase(createRewardByVendor.pending, (state)=>{
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(createRewardByVendor.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.totalRewards += 1;
                if (state.VendorRewards.length < state.limit) {
                state.VendorRewards.unshift(action.payload);
                }
            })
            .addCase(createRewardByVendor.rejected, (state)=>{
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            })

            // VIEW REWARD 
            .addCase(viewRewardByVendor.pending, (state)=>{
                state.singleLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(viewRewardByVendor.fulfilled, (state, action)=>{
                state.singleLoading = false;
                state.isError = false;
                state.isSuccess = true;
                state.selectedReward = action.payload.data;
            })
            .addCase(viewRewardByVendor.rejected, (state)=>{
                state.singleLoading = false;
                state.isError = true;
                state.isSuccess = false;
            })


            // UPDATE REWARD 
            .addCase(updateRewardByVendor.pending, (state)=>{
                state.isLoading = true;
                state.isError = false;
                state.isSuccess = false;
            })
            .addCase(updateRewardByVendor.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.isSuccess = true;

                const updatedReward = action.payload.data;

                // remove old version
                state.VendorRewards = state.VendorRewards.filter(
                    (reward) => reward._id !== updatedReward._id
                );

                // add updated reward on top (unshift)
                state.VendorRewards.unshift(updatedReward);
            })
            .addCase(updateRewardByVendor.rejected, (state)=>{
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
            })

            // DELETE REWARD BY VENDOR
            .addCase(deleteRewardByVendor.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            })

            .addCase(deleteRewardByVendor.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;

            const deletedId = action.meta.arg;

            // remove deleted reward from list
            state.VendorRewards = state.VendorRewards.filter(
                (reward) => reward._id !== deletedId
            );

            // update count safely
            if (state.totalRewards > 0) {
                state.totalRewards -= 1;
            }
            })

            .addCase(deleteRewardByVendor.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            })



    }
})

export const { reset } = vendorRewardSlice.actions;
export default vendorRewardSlice.reducer;