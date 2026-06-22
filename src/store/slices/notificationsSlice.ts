import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notificationsApi } from "@/api/notifications.api";
import { mapInboxResponse } from "@/lib/notifications";
import type { ApiError, NotificationItem } from "@/types/api";

type NotificationsState = {
  items: NotificationItem[];
  loading: boolean;
  markReadLoading: boolean;
  markAllLoading: boolean;
  error: string | null;
};

const initialState: NotificationsState = {
  items: [],
  loading: false,
  markReadLoading: false,
  markAllLoading: false,
  error: null,
};

export const fetchInbox = createAsyncThunk(
  "notifications/fetchInbox",
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationsApi.getInbox();
      return mapInboxResponse(response.data);
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to load notifications");
    }
  },
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationsApi.markAsRead(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to mark notification read");
    }
  },
);

export const markAllNotificationsRead = createAsyncThunk(
  "notifications/markAllNotificationsRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationsApi.markAllAsRead();
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(
        apiError.message ?? "Failed to mark all notifications read",
      );
    }
  },
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInbox.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInbox.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInbox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markNotificationRead.pending, (state) => {
        state.markReadLoading = true;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.markReadLoading = false;
        const item = state.items.find((n) => n.id === action.payload);

        if (item) {
          item.read = true;
        }
      })
      .addCase(markNotificationRead.rejected, (state) => {
        state.markReadLoading = false;
      })
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.markAllLoading = true;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.markAllLoading = false;
        state.items = state.items.map((item) => ({ ...item, read: true }));
      })
      .addCase(markAllNotificationsRead.rejected, (state) => {
        state.markAllLoading = false;
      });
  },
});

export const { clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
