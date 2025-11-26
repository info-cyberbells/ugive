import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getSuperAdminProfileService,
    // createUniversityService,
    // updateUniversityService
} from '..//auth/authServices';


//fetch superadmin profile
export const fetchSuperAdminProfile = createAsyncThunk(
    'superadmin/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSuperAdminProfileService();
            return response.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 'Failed to fetch profile'
            );
        }
    }
);

// // Create University (EXISTING)
// export const createUniversity = createAsyncThunk(
//     'superadmin/createUniversity',
//     async (universityData, { rejectWithValue }) => {
//         try {
//             const response = await createUniversityService(universityData);
//             return response.university;
//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data?.message || 'Failed to create university'
//             );
//         }
//     }
// );

// // Update University (EXISTING)
// export const updateUniversity = createAsyncThunk(
//     'superadmin/updateUniversity',
//     async ({ id, universityData }, { rejectWithValue }) => {
//         try {
//             const response = await updateUniversityService(id, universityData);
//             return response.university;
//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data?.message || 'Failed to update university'
//             );
//         }
//     }
// );

const initialState = {
    profile: null,
    profileLoading: false,
    profileError: null,

    universities: [],
    universitiesLoading: false,
    universitiesError: null,

    loading: false,
    error: null,
    success: false,
};

const superadminSlice = createSlice({
    name: 'superadmin',
    initialState,
    reducers: {
        resetState: (state) => {
            state.success = false;
            state.error = null;
        },
        clearProfile: (state) => {
            state.profile = null;
            state.profileError = null;
        },
    },
    extraReducers: (builder) => {
        builder
           //fetch superadmin profile
            .addCase(fetchSuperAdminProfile.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
            })
            .addCase(fetchSuperAdminProfile.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profile = action.payload;
                state.profileError = null;
            })
            .addCase(fetchSuperAdminProfile.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload;
            })

            // // ===== CREATE UNIVERSITY (EXISTING) =====
            // .addCase(createUniversity.pending, (state) => {
            //     state.universitiesLoading = true;
            //     state.universitiesError = null;
            // })
            // .addCase(createUniversity.fulfilled, (state, action) => {
            //     state.universitiesLoading = false;
            //     state.universities.push(action.payload);
            //     state.success = true;
            // })
            // .addCase(createUniversity.rejected, (state, action) => {
            //     state.universitiesLoading = false;
            //     state.universitiesError = action.payload;
            // })

            // // ===== UPDATE UNIVERSITY (EXISTING) =====
            // .addCase(updateUniversity.pending, (state) => {
            //     state.universitiesLoading = true;
            //     state.universitiesError = null;
            // })
            // .addCase(updateUniversity.fulfilled, (state, action) => {
            //     state.universitiesLoading = false;
            //     const index = state.universities.findIndex(
            //         (uni) => uni.id === action.payload.id
            //     );
            //     if (index !== -1) {
            //         state.universities[index] = action.payload;
            //     }
            //     state.success = true;
            // })
            // .addCase(updateUniversity.rejected, (state, action) => {
            //     state.universitiesLoading = false;
            //     state.universitiesError = action.payload;
            // });
    },
});

export const { resetState, clearProfile } = superadminSlice.actions;
export default superadminSlice.reducer;