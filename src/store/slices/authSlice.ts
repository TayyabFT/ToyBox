import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth.api";
import { invitationsApi } from "@/api/invitations.api";
import type {
  ApiError,
  SetupPasswordRequest,
  SignInData,
  SignInRequest,
  VerifyOtpData,
  VerifyOtpRequest,
} from "@/types/api";

type AuthState = {
  user: SignInData | null;
  verifyOtpData: VerifyOtpData | null;
  loading: boolean;
  verifyOtpLoading: boolean;
  setupPasswordLoading: boolean;
  refreshLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  verifyOtpData: null,
  loading: false,
  verifyOtpLoading: false,
  setupPasswordLoading: false,
  refreshLoading: false,
  error: null,
};

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (payload: SignInRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.signIn(payload);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Sign in failed");
    }
  },
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (payload: VerifyOtpRequest, { rejectWithValue }) => {
    try {
      const response = await invitationsApi.verifyOtp(payload);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "OTP verification failed");
    }
  },
);

export const setupPassword = createAsyncThunk(
  "auth/setupPassword",
  async (payload: SetupPasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authApi.setupPassword(payload);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to set password");
    }
  },
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshToken();
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to refresh token");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.verifyOtpLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.verifyOtpLoading = false;
        state.verifyOtpData = action.payload.data;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyOtpLoading = false;
        state.error = action.payload as string;
      })
      .addCase(setupPassword.pending, (state) => {
        state.setupPasswordLoading = true;
        state.error = null;
      })
      .addCase(setupPassword.fulfilled, (state, action) => {
        state.setupPasswordLoading = false;
        state.user = action.payload.data;
      })
      .addCase(setupPassword.rejected, (state, action) => {
        state.setupPasswordLoading = false;
        state.error = action.payload as string;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.refreshLoading = true;
        state.error = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.refreshLoading = false;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.refreshLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
