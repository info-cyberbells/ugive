import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createNotificationService,
    getAllNotificationsService,
    toggleNotificationService,
    updateNotificationService,
    deleteNotificationService,
} from "../auth/authServices";

// Create notification
export const createNotification = createAsyncThunk(
    "notification/create",
    async (data, thunkAPI) => {
        try {
            const response = await createNotificationService(data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to create notification"
            );
        }
    }
);

// Get all notifications
export const getAllNotifications = createAsyncThunk(
    "notification/getAll",
    async (_, thunkAPI) => {
        try {
            const response = await getAllNotificationsService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to fetch notifications"
            );
        }
    }
);

// Toggle notification status
export const toggleNotification = createAsyncThunk(
    "notification/toggle",
    async (id, thunkAPI) => {
        try {
            const response = await toggleNotificationService(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to toggle notification"
            );
        }
    }
);

// Update notification
export const updateNotification = createAsyncThunk(
    "notification/update",
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await updateNotificationService(id, data);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to update notification"
            );
        }
    }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
    "notification/delete",
    async (id, thunkAPI) => {
        try {
            const response = await deleteNotificationService(id);
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to delete notification"
            );
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: "",
    },
    reducers: {
        clearNotificationMessages: (state) => {
            state.isError = false;
            state.isSuccess = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
            // Create notification
            .addCase(createNotification.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(createNotification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications.unshift(action.payload.data);
                state.message = "Notification created successfully";
            })
            .addCase(createNotification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Get all notifications
            .addCase(getAllNotifications.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getAllNotifications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notifications = action.payload.data;
            })
            .addCase(getAllNotifications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Toggle notification
            .addCase(toggleNotification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(toggleNotification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const updatedNotification = action.payload.data;
                state.notifications = state.notifications.map((notif) =>
                    notif._id === updatedNotification._id ? updatedNotification : notif
                );
                state.message = action.payload.message;
            })
            .addCase(toggleNotification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Update notification
            .addCase(updateNotification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateNotification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const updatedNotification = action.payload.data;
                state.notifications = state.notifications.map((notif) =>
                    notif._id === updatedNotification._id ? updatedNotification : notif
                );
                state.message = action.payload.message;
            })
            .addCase(updateNotification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Delete notification
            .addCase(deleteNotification.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const deletedId = action.meta.arg;
                state.notifications = state.notifications.filter(
                    (notif) => notif._id !== deletedId
                );
                state.message = "Notification deleted successfully";
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { clearNotificationMessages } = notificationSlice.actions;
export default notificationSlice.reducer;