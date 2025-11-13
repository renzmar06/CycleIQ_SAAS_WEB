import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface AuthState {
    user: any;
    token: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            return {
                user: JSON.parse(userData),
                token,
                loading: false,
                error: null,
                isAuthenticated: true,
            };
        }
    }
    
    return {
        user: null,
        token: null,
        loading: false,
        error: null,
        isAuthenticated: false,
    };
};

const initialState: AuthState = getInitialState();

// ✅ Async Thunk (standard Redux Toolkit)
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (
        credentials: { email: string; password: string },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await axios.post("/api/login", credentials);
            return data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Login failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await axios.post("/api/logout");
            return true;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Logout failed");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            if (typeof window !== 'undefined') {
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.user = payload.user;
                state.token = payload.token;
                state.isAuthenticated = true;
                if (typeof window !== 'undefined') {
                    localStorage.setItem("token", payload.token);
                    localStorage.setItem("userData", JSON.stringify(payload.user));
                }
            })
            .addCase(loginUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                if (typeof window !== 'undefined') {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userData");
                }
            });
    },
});

export const { logout } = authSlice.actions;
export { logoutUser };
export default authSlice.reducer;
