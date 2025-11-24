import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginService, registerService } from "../auth/authServices";

const user = JSON.parse(localStorage.getItem("User"));

const initialState = {
    user: user || null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
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
    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;
