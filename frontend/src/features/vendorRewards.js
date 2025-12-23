import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllRewardVendorService } from "../auth/authServices";


const initialState = {
    VendorRewards: [],
    selectedReward: null,
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


    }
})

export const { reset } = vendorRewardSlice.actions;
export default vendorRewardSlice.reducer;