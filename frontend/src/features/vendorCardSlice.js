import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPrintedCardVendorService, updateCardStatusVendorService } from "../auth/authServices";



// GET VENDOR PROFILE

export const getPrintedCards = createAsyncThunk(
    'vendorCards/getProfile',
    async({limit, page}, thunkAPI)=>{
        try {
            const response = await getPrintedCardVendorService({limit, page});
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to get Cards");
        }
    }
);

// UPDATE CARD STATUS THUNK

export const updateCardStatusByVendor = createAsyncThunk(
    'vendorCards/updateStatus',
    async({id, status}, thunkAPI) => {
        try {
            const response = await updateCardStatusVendorService(id, status);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update cards status");
        }
    }
)



const vendorCardSlice = createSlice({
    name: "vendorCards",
    initialState: {
        printedCards: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },

    reducers: {
        reset: (state) => {
            state.printedCards= [];
            state.page= 1;
            state.limit= 10;
            state.total= 0;
            state.totalPages= 1;
            state.isLoading= false;
            state.isError= false;
            state.isSuccess= false;
            state.message = "";
        },
    },

    extraReducers: (builder)=>{
        builder

        // get printed cards
        .addCase(getPrintedCards.pending, (state)=>{
            state.isLoading = true;
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        })
        .addCase(getPrintedCards.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.printedCards = action.payload.data;
            state.totalPages = action.payload.totalPages;
            state.limit = action.payload.limit;
            state.total = action.payload.total;
            state.page = action.payload.page;
        })
        .addCase(getPrintedCards.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.isSuccess = false;
            state.message = action.payload || "Failed to get printed cards"
        })

        // update card status by admin
      .addCase(updateCardStatusByVendor.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateCardStatusByVendor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedCard = action.payload.data;

        state.printedCards = state.printedCards.map((card) =>
          card._id === updatedCard._id
            ? { ...card, status: updatedCard.status }
            : card
        );
      })
      .addCase(updateCardStatusByVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to update card status";
      })

        

    }

})

export default vendorCardSlice.reducer;