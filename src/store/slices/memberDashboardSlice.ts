import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "@/api/auth.api";
import { clubhouseApi } from "@/api/clubhouse.api";
import { memberDashboardApi } from "@/api/memberDashboard.api";
import { notificationsApi } from "@/api/notifications.api";
import type { MemberActivityItem, MemberDashboardData } from "@/components/member/dashboard/types";
import {
  createEmptyMemberDashboard,
  mapMemberDashboard,
  mapQuickActions,
  type MemberQuickActionView,
} from "@/lib/memberDashboard";
import type { ApiError } from "@/types/api";

type MemberDashboardState = {
  data: MemberDashboardData;
  quickActions: MemberQuickActionView[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
};

const initialState: MemberDashboardState = {
  data: createEmptyMemberDashboard(),
  quickActions: mapQuickActions(),
  loading: false,
  loaded: false,
  error: null,
};

export const fetchMemberDashboard = createAsyncThunk(
  "memberDashboard/fetch",
  async (force: boolean | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { memberDashboard: MemberDashboardState };
      if (state.memberDashboard.loaded && !force) {
        return {
          data: state.memberDashboard.data,
          quickActions: state.memberDashboard.quickActions,
        };
      }

      const [dashboardResponse, profileResponse, inboxResponse, clubhouseResponse] =
        await Promise.all([
          memberDashboardApi.getSummary(),
          authApi.getProfile(),
          notificationsApi.getInbox().catch(() => null),
          clubhouseApi.getOverview().catch(() => null),
        ]);

      return {
        data: mapMemberDashboard(
          dashboardResponse.data,
          profileResponse.data,
          inboxResponse?.data,
          clubhouseResponse?.data,
        ),
        quickActions: mapQuickActions(dashboardResponse.data?.quickActions),
      };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.message ?? "Failed to load member dashboard",
      );
    }
  },
);

const memberDashboardSlice = createSlice({
  name: "memberDashboard",
  initialState,
  reducers: {
    clearMemberDashboard: (state) => {
      state.data = createEmptyMemberDashboard();
      state.quickActions = mapQuickActions();
      state.loaded = false;
      state.error = null;
    },
    /** Prepend a parking activity item to recentActivity (max 4 kept). */
    prependParkingActivity: (state, action: PayloadAction<MemberActivityItem>) => {
      state.data.recentActivity = [
        action.payload,
        ...state.data.recentActivity,
      ].slice(0, 4);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.data = action.payload.data;
        state.quickActions = action.payload.quickActions;
      })
      .addCase(fetchMemberDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearMemberDashboard, prependParkingActivity } = memberDashboardSlice.actions;
export default memberDashboardSlice.reducer;
