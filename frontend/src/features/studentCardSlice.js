import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sendCardService, checkCardEligibilityService, getCardListingService, getRemainingCardService, checkBanWordsService } from "../auth/authServices";


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

//  GET SENTS CARDS THUNK
export const getSentCards = createAsyncThunk(
    'card/getSentCards',
    async(_, thunkAPI) => {
        try {
            const response = await getCardListingService();
            return response.cards;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch information");
        }
    }
)

// GET STUDENT REMAINING CARD PROGRESS

export const remainingCardProgress = createAsyncThunk(
    'card/getRemainingCardProgress',
    async (_, thunkAPI) => {
        try {
            const response = await getRemainingCardService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data?.message || "Failed to fetch Card Progress");
        }
    }    
)

// BAN WORD CHECK THUNK 
export const checkBanWords = createAsyncThunk (
    'card/checkforbanWords',
    async (message, {rejectWithValue}) => {
        try {
            const response = await checkBanWordsService(message);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Message Validation Failed")
        }
    }
);


const studentCardSlice = createSlice({
    name: "studentCard",
    initialState: {
        studentCard: null,
        cardsData: null,
        sentCards: [],
        cardsProgress: null,
        isLoading: false,
        isError: false,
        message: "",
        eligibility: null,
        banWordCheck: null,
        banWordError: null,
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
            })

            // get sents cards

            .addCase(getSentCards.pending, (state)=>{
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getSentCards.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.sentCards = action.payload; 
            })
            .addCase(getSentCards.rejected, (state, action) =>{
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            //Remaining Cards & progress 
            .addCase(remainingCardProgress.pending, (state)=>{
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(remainingCardProgress.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.cardsProgress = action.payload;
            })
            .addCase(remainingCardProgress.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // check for ban words
            .addCase(checkBanWords.pending, (state)=>{
                state.isLoading = true;
                state.isError = false;
                state.banWordError = null;
            })
            .addCase(checkBanWords.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.banWordCheck = action.payload;
            })
            .addCase(checkBanWords.rejected, (state, action)=>{
                state.isLoading = false;
                state.isError = true;
                state.banWordError = action.payload;
            })
    }
});

export const { resetCardState } = studentCardSlice.actions;
export default studentCardSlice.reducer;
