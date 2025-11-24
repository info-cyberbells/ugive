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

// export const verify = createAsyncThunk("auth/verify",
//     async (_, thunkAPI) => {
//         try {
//             return await verifyService();
//         } catch (error) {
//             return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
//         }
//     }
// );

// export const logout = createAsyncThunk("auth/logout",
//     async () => {
//         return await logoutService();
//     }
// )




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
                state.user = action.payload.user;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true; 
                state.message = action.payload;
                // state.user = action.payload.user;
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
                // state.user = action.payload.user;
                state.user = null;
            })

        // //verify user
        // .addCase(verify.fulfilled, (state, action) => {
        //     state.user = action.payload.user;
        // })

        // //Logout user
        // .addCase(logout.fulfilled, (state) => {
        //     state.user = null;
        // })
    }
})

export const { reset } = authSlice.actions;
export default authSlice.reducer;
