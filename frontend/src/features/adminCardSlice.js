import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteCardByAdminService,
  getUniversityCardsForAdminService,
  updateCardStatusByAdminService,
} from "../auth/authServices";

// admin get card of students

export const getAdminStudentCards = createAsyncThunk(
  "admin/getAdminCards",
  async ({ page = 1, limit = 10 }, thunkAPI) => {
    try {
      const response = await getUniversityCardsForAdminService({ page, limit });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin cards"
      );
    }
  }
);

// UPDATE CARD STATUS BY ADMIN
export const updateCardStatusByAdmin = createAsyncThunk(
  "admin/updateCardSatus",
  async ({ cardId, status }, thunkAPI) => {
    try {
      const response = await updateCardStatusByAdminService({ cardId, status });
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update card status"
      );
    }
  }
);

// DELETE CARD BY ADMIN

export const deleteCardByAdmin = createAsyncThunk(
  "admin/deleteCard",
  async (cardId, thunkAPI) => {
    try {
      const response = await deleteCardByAdminService(cardId);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete card"
      );
    }
  }
);

const adminCardSlice = createSlice({
  name: "adminCard",
  initialState: {
    adminCards: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    count: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    cardStatus: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // get admin cards of students
      .addCase(getAdminStudentCards.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getAdminStudentCards.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.adminCards = action.payload.data;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.count = action.payload.count;
      })
      .addCase(getAdminStudentCards.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch admin cards";
      })

      // update card status by admin
      .addCase(updateCardStatusByAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(updateCardStatusByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const updatedCard = action.payload.data;

        state.adminCards = state.adminCards.map((card) =>
          card._id === updatedCard._id
            ? { ...card, status: updatedCard.status }
            : card
        );
      })
      .addCase(updateCardStatusByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to update card status";
      })

      // admin delete card by admin
      .addCase(deleteCardByAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteCardByAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const deletedCardId = action.meta.arg;

        state.adminCards = state.adminCards.filter(
          (card) => card._id !== deletedCardId
        );

        state.total = Math.max(0, state.total - 1);
        state.count = Math.max(0, state.count - 1);
      })
      .addCase(deleteCardByAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to delete card";
      });
  },
});

export default adminCardSlice.reducer;
