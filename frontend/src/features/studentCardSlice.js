import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendCardService, checkCardEligibilityService } from "../auth/authServices";


// send card thunk
export const sendStudentCard = createAsyncThunk(
    "card/sendStudentCard",
    async (card, thunkAPI) => {
        try {
            return await sendCardService(card);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to send Card"
            );
        }
    }
);

// check card eligibility thunk
export const checkCardEligibility = createAsyncThunk(
    "card/checkCardEligibility",
    async (_, thunkAPI) => {
        try {
            return await checkCardEligibilityService();
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || { eligible: false, message: "Failed to check eligibility" }
            );
        }
    }
);

const studentCardSlice = createSlice({
    name: "studentCard",
    initialState: {
        studentCard: null,
        cardsData: null,
        isLoading: false,
        isError: false,
        message: "",
        eligibility: null,
    },
    reducers: {
        resetCardState: (state) => {
            state.rewards = [];
            state.isLoading = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendStudentCard.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendStudentCard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.studentCard = action.payload.card;
                state.cardsData = action.payload.cardsData;
                state.message = action.payload.message;
            })
            .addCase(sendStudentCard.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(checkCardEligibility.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkCardEligibility.fulfilled, (state, action) => {
                state.isLoading = false;
                state.eligibility = action.payload;
            })
            .addCase(checkCardEligibility.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.eligibility = action.payload;
            });
    }
});

export const { resetCardState } = studentCardSlice.actions;
export default studentCardSlice.reducer;
