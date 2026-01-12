import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    searchUsersService,
    getFriendsListService,
    sendFriendRequestService,
    acceptFriendRequestService,
    deleteFriendRequestService,
    unfriendService,
    getSentRequestsService,
    getReceivedRequestsService,
    getStudentCollegePeopleService,
} from "../auth/authServices";

// Async Thunks
export const searchUsers = createAsyncThunk(
    "friends/searchUsers",
    async ({ name, email, college, university, filterMode = "global" }, { rejectWithValue }) => {
        try {
            const response = await searchUsersService(name, email, college, university, filterMode);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to search users"
            );
        }
    }
);
export const getFriendsList = createAsyncThunk(
    "friends/getFriendsList",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getFriendsListService();
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch friends list"
            );
        }
    }
);

export const acceptFriendRequest = createAsyncThunk(
    "friends/acceptFriendRequest",
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await acceptFriendRequestService(requestId);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to accept friend request"
            );
        }
    }
);

export const deleteFriendRequest = createAsyncThunk(
    "friends/deleteFriendRequest",
    async (requestId, { rejectWithValue }) => {
        try {
            const response = await deleteFriendRequestService(requestId);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete friend request"
            );
        }
    }
);

export const unfriend = createAsyncThunk(
    "friends/unfriend",
    async (friendId, { rejectWithValue }) => {
        try {
            const response = await unfriendService(friendId);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to unfriend"
            );
        }
    }
);

export const getSentRequests = createAsyncThunk(
    "friends/getSentRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSentRequestsService();
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch sent requests"
            );
        }
    }
);

export const getReceivedRequests = createAsyncThunk(
    "friends/getReceivedRequests",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getReceivedRequestsService();
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch received requests"
            );
        }
    }
);

export const sendFriendRequest = createAsyncThunk(
    "friends/sendFriendRequest",
    async (receiverId, { rejectWithValue }) => {
        try {
            const response = await sendFriendRequestService(receiverId);
            return response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to send friend request"
            );
        }
    }
);

// GET COLLEGE FRIENDS THUNK
export const getCollegePeople = createAsyncThunk(
    'friends/getCollegeFriends',
    async (_, thunkAPI) => {
        try {
            const response = await getStudentCollegePeopleService();
            return response;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch");
        }
    }
);

// Initial State
const initialState = {
    friends: [],
    searchResults: [],
    sentRequests: [],
    receivedRequests: [],
    collegePeople: [],
    collegePeopleLoading: false,
    loading: false,
    searchLoading: false,
    sendRequestLoading: false,
    acceptRequestLoading: false,
    deleteRequestLoading: false,
    unfriendLoading: false,
    sentRequestsLoading: false,
    receivedRequestsLoading: false,
    error: null,
    searchError: null,
    sendRequestError: null,
    successMessage: null,
};


// Slice
const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchError = null;
        },
        clearMessages: (state) => {
            state.error = null;
            state.successMessage = null;
            state.sendRequestError = null;
        },
    },
    extraReducers: (builder) => {
        // Search Users
        builder
            .addCase(searchUsers.pending, (state) => {
                state.searchLoading = true;
                state.searchError = null;
            })
            .addCase(searchUsers.fulfilled, (state, action) => {
                state.searchLoading = false;
                state.searchResults = action.payload.results || [];
                state.searchError = null;
            })
            .addCase(searchUsers.rejected, (state, action) => {
                state.searchLoading = false;
                state.searchError = action.payload;
                state.searchResults = [];
            });

        // Get Friends List
        builder
            .addCase(getFriendsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFriendsList.fulfilled, (state, action) => {
                state.loading = false;
                state.friends = action.payload.results || [];
                state.error = null;
            })
            .addCase(getFriendsList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.friends = [];
            });

        // Send Friend Request
        builder
            .addCase(sendFriendRequest.pending, (state) => {
                state.sendRequestLoading = true;
                state.sendRequestError = null;
                state.successMessage = null;
            })
            .addCase(sendFriendRequest.fulfilled, (state, action) => {
                state.sendRequestLoading = false;
                state.successMessage = action.payload.message || "Friend request sent successfully";
                state.sendRequestError = null;
            })
            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.sendRequestLoading = false;
                state.sendRequestError = action.payload;
                state.successMessage = null;
            })
            .addCase(acceptFriendRequest.pending, (state) => {
                state.acceptRequestLoading = true;
            })
            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                state.acceptRequestLoading = false;
                state.successMessage = action.payload.message || "Friend request accepted";
                // Remove from received requests
                state.receivedRequests = state.receivedRequests.filter(
                    (req) => (req.id || req._id) !== action.meta.arg
                );
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.acceptRequestLoading = false;
                state.error = action.payload;
            });

        // Delete Friend Request
        builder
            .addCase(deleteFriendRequest.pending, (state) => {
                state.deleteRequestLoading = true;
            })
            .addCase(deleteFriendRequest.fulfilled, (state, action) => {
                state.deleteRequestLoading = false;
                state.successMessage = action.payload.message || "Friend request deleted";
                // Remove from received requests
                state.receivedRequests = state.receivedRequests.filter(
                    (req) => (req.id || req._id) !== action.meta.arg
                );
            })
            .addCase(deleteFriendRequest.rejected, (state, action) => {
                state.deleteRequestLoading = false;
                state.error = action.payload;
            });

        // Unfriend
        builder
            .addCase(unfriend.pending, (state) => {
                state.unfriendLoading = true;
            })
            .addCase(unfriend.fulfilled, (state, action) => {
                state.unfriendLoading = false;
                state.successMessage = action.payload.message || "Unfriended successfully";
                // Remove from friends list
                state.friends = state.friends.filter(
                    (friend) => (friend.id || friend._id) !== action.meta.arg
                );
            })
            .addCase(unfriend.rejected, (state, action) => {
                state.unfriendLoading = false;
                state.error = action.payload;
            });

        // Get Sent Requests
        builder
            .addCase(getSentRequests.pending, (state) => {
                state.sentRequestsLoading = true;
            })
            .addCase(getSentRequests.fulfilled, (state, action) => {
                state.sentRequestsLoading = false;
                state.sentRequests = action.payload.results || [];
            })
            .addCase(getSentRequests.rejected, (state, action) => {
                state.sentRequestsLoading = false;
                state.error = action.payload;
            });

        // Get Received Requests
        builder
            .addCase(getReceivedRequests.pending, (state) => {
                state.receivedRequestsLoading = true;
            })
            .addCase(getReceivedRequests.fulfilled, (state, action) => {
                state.receivedRequestsLoading = false;
                state.receivedRequests = action.payload.results || [];
            })
            .addCase(getReceivedRequests.rejected, (state, action) => {
                state.receivedRequestsLoading = false;
                state.error = action.payload;
            })

            // get college friends
            .addCase(getCollegePeople.pending, (state) => {
                state.collegePeopleLoading = true;
                state.error = false;
            })
            .addCase(getCollegePeople.fulfilled, (state, action) => {
                state.collegePeopleLoading = false;
                state.collegePeople = action.payload;
            })
            .addCase(getCollegePeople.rejected, (state, action) => {
                state.collegePeopleLoading = false;
                state.error = action.payload;
            })
    },
});

export const { clearSearchResults, clearMessages } = friendsSlice.actions;
export default friendsSlice.reducer;