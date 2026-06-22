import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { invitationsApi } from "@/api/invitations.api";
import type { ApiError, InviteRequest, ResendOtpRequest } from "@/types/api";

type AdminState = {
  inviteLoading: boolean;
  resendLoading: boolean;
};

const initialState: AdminState = {
  inviteLoading: false,
  resendLoading: false,
};

export const sendInvite = createAsyncThunk(
  "admin/sendInvite",
  async (payload: InviteRequest, { rejectWithValue }) => {
    try {
      const response = await invitationsApi.send(payload);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to send invite");
    }
  },
);

export const resendOtp = createAsyncThunk(
  "admin/resendOtp",
  async (payload: ResendOtpRequest, { rejectWithValue }) => {
    try {
      const response = await invitationsApi.resend(payload);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to resend OTP");
    }
  },
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendInvite.pending, (state) => {
        state.inviteLoading = true;
      })
      .addCase(sendInvite.fulfilled, (state) => {
        state.inviteLoading = false;
      })
      .addCase(sendInvite.rejected, (state) => {
        state.inviteLoading = false;
      })
      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resendLoading = false;
      })
      .addCase(resendOtp.rejected, (state) => {
        state.resendLoading = false;
      });
  },
});

export default adminSlice.reducer;
