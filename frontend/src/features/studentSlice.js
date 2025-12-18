import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, registerService, getPublicUniversitiesService, getCollegesService, forgotPasswordService, resetPasswordService, getSocialLinksService, addSocialLinkService, updateSocialLinkService, deleteSocialLinkService } from "../auth/authServices";

const user = JSON.parse(localStorage.getItem("User"));

const initialState = {
    user: user || null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    universities: [],
    colleges: [],
    social: [],
}

//Login Thunk
export const login = createAsyncThunk("auth/login",
    async (userData, thunkAPI) => {
        try {
            return await loginService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//Register Thunk
export const register = createAsyncThunk("auth/register",
    async (userData, thunkAPI) => {
        try {
            return await registerService(userData);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


// Get Public Universities
export const getUniversities = createAsyncThunk(
    "auth/getUniversities",
    async (_, thunkAPI) => {
        try {
            return await getPublicUniversitiesService();
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//get colleges of a university
export const getColleges = createAsyncThunk(
    "auth/getColleges",
    async (universityId, thunkAPI) => {
        try {
            return await getCollegesService(universityId);
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

//send reset code
export const sendResetCode = createAsyncThunk(
    "auth/sendResetCode",
    async (email, thunkAPI) => {
        try {
            return await forgotPasswordService(email);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//reset password
export const verifyAndReset = createAsyncThunk(
    "auth/verifyAndReset",
    async (data, thunkAPI) => {
        try {
            return await resetPasswordService(data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

//get socail link service

export const getSocialLinks = createAsyncThunk(
    'auth/getSocialLinks',
    async (_, thunkAPI) => {
        try {
            const response = await getSocialLinksService();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);


export const addSocialLink = createAsyncThunk(
    "auth/addSocialLink",
    async (formData, thunkAPI) => {
        try {
            const response = await addSocialLinkService(formData);
            return response.data; 
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const updateSocialLink = createAsyncThunk(
    "auth/updateSocialLink",
    async ({ id, formData }, thunkAPI) => {
        try {
            const response = await updateSocialLinkService(id, formData);
            return response.data; 
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const deleteSocialLink = createAsyncThunk(
    "auth/deleteSocialLink",
    async (id, thunkAPI) => {
        try {
            await deleteSocialLinkService(id);
            return id; 
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);




const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        },
        logout: (state) => {
            state.user = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        builder
            //Login Student
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = "Login successful";

                const user = action.payload.user;

                if (user && user._id) {
                    const minimalUser = {
                        _id: user._id,
                        name: user.name || user.fullName || user.firstName || "",
                        role: user.role || "",
                    };

                    state.user = minimalUser;

                    if (action.payload.token) {
                        localStorage.setItem("token", action.payload.token);
                    }

                    localStorage.setItem("user", JSON.stringify(minimalUser));

                    if (user.role === "admin" && user.university) {
                    localStorage.setItem("universityId", user.university);
                    }
                    
                    if (user.role === "admin" && Array.isArray(user.colleges)) {
                    localStorage.setItem("colleges", JSON.stringify(user.colleges));
                    }

                }
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            //Register Student
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.user;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            //get all public universities
            .addCase(getUniversities.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUniversities.fulfilled, (state, action) => {
                state.isLoading = false;
                state.universities = action.payload.data;
            })
            .addCase(getUniversities.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            //get colleges of a  university
            .addCase(getColleges.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getColleges.fulfilled, (state, action) => {
                state.isLoading = false;
                state.colleges = action.payload.data;
            })
            .addCase(getColleges.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Send code
            .addCase(sendResetCode.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendResetCode.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(sendResetCode.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Verify & reset
            .addCase(verifyAndReset.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyAndReset.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(verifyAndReset.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            //get social links 
            .addCase(getSocialLinks.pending, (state)=>{
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(getSocialLinks.fulfilled, (state, action)=>{
                state.isLoading = false;
                state.isError = false;
                state.social = action.payload;
            })
            .addCase(getSocialLinks.rejected, (state)=>{
                state.isLoading = false;
                state.isError = true;
            })

            // ADD SOCIAL LINK
            .addCase(addSocialLink.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addSocialLink.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.social.unshift(action.payload);
            })
            .addCase(addSocialLink.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // UPDATE SOCIAL LINK
            .addCase(updateSocialLink.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSocialLink.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;

                const updated = action.payload;
                state.social = state.social.map(item =>
                    item._id === updated._id ? updated : item
                );
            })
            .addCase(updateSocialLink.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // DELETE SOCIAL LINK
            .addCase(deleteSocialLink.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSocialLink.fulfilled, (state, action) => {
                state.isLoading = false;
            const deletedId = action.payload;
            state.social = state.social.filter((item) => item._id !== deletedId);
            })
            .addCase(deleteSocialLink.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });



    }
})

export const { reset, logout } = authSlice.actions;
export default authSlice.reducer;