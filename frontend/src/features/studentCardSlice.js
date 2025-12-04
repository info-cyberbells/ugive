import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendCardService } from "../auth/authServices";


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

const studentCardSlice = createSlice({
    name: "studentCard",
    initialState: {
        studentCard: null,
        cardsData: null,
        isLoading: false,
        isError: false,
        message: "",
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
            });
    }
});

export const { resetCardState } = studentCardSlice.actions;
export default studentCardSlice.reducer;
