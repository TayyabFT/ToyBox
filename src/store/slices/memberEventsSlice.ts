import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { memberEventsApi } from "@/api/memberEvents.api";
import { groupFlatEvents } from "@/lib/memberEvents";
import type { EventItem, EventFilter } from "@/components/member/events/types";
import type { ApiError } from "@/types/api";

// ── State ────────────────────────────────────────────────────────────────────

type MemberEventsState = {
  featured: EventItem[];
  thisWeek: EventItem[];
  nextMonth: EventItem[];
  otherUpcoming: EventItem[];
  past: EventItem[];
  activeFilter: EventFilter;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  /** Track in-flight RSVP actions per event id */
  rsvpLoading: Record<string, boolean>;
  /** Track in-flight favorite toggle actions per event id */
  favoriteLoading: Record<string, boolean>;
};

const initialState: MemberEventsState = {
  featured: [],
  thisWeek: [],
  nextMonth: [],
  otherUpcoming: [],
  past: [],
  activeFilter: "all",
  loading: false,
  loaded: false,
  error: null,
  rsvpLoading: {},
  favoriteLoading: {},
};

// ── Async Thunks ─────────────────────────────────────────────────────────────

/** Fetch flat events and group them client-side to ensure no events are hidden */
export const fetchMemberEvents = createAsyncThunk(
  "memberEvents/fetch",
  async (category: string = "all", { rejectWithValue }) => {
    try {
      const res = await memberEventsApi.getFlat({ category, limit: 100 });
      return groupFlatEvents(res.data.events);
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to load events");
    }
  },
);

/** Join an event (RSVP → going) */
export const joinEvent = createAsyncThunk(
  "memberEvents/join",
  async (id: string, { rejectWithValue }) => {
    try {
      await memberEventsApi.join(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to RSVP");
    }
  },
);

/** Leave an event (cancel RSVP) */
export const leaveEvent = createAsyncThunk(
  "memberEvents/leave",
  async (id: string, { rejectWithValue }) => {
    try {
      await memberEventsApi.leave(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to cancel RSVP");
    }
  },
);

/** Join the waitlist for a full event */
export const joinEventWaitlist = createAsyncThunk(
  "memberEvents/joinWaitlist",
  async (id: string, { rejectWithValue }) => {
    try {
      await memberEventsApi.joinWaitlist(id);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to join waitlist");
    }
  },
);

/** Toggle favorite/bookmark status for an event */
export const toggleFavoriteEvent = createAsyncThunk(
  "memberEvents/toggleFavorite",
  async (
    { id, isFavorite }: { id: string; isFavorite: boolean },
    { rejectWithValue },
  ) => {
    try {
      await memberEventsApi.toggleFavorite(id, isFavorite);
      return { id, isFavorite };
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue(apiError.message ?? "Failed to update favorite status");
    }
  },
);

// ── Helpers ──────────────────────────────────────────────────────────────────

function patchEventStatus(
  events: EventItem[],
  id: string,
  status: EventItem["userStatus"],
): EventItem[] {
  return events.map((e) =>
    e.id === id ? { ...e, userStatus: status } : e,
  );
}

function patchEventFavorite(
  events: EventItem[],
  id: string,
  isFavorite: boolean,
): EventItem[] {
  return events.map((e) =>
    e.id === id ? { ...e, isFavorite } : e,
  );
}

function patchAll(
  state: MemberEventsState,
  id: string,
  status: EventItem["userStatus"],
) {
  state.featured = patchEventStatus(state.featured, id, status);
  state.thisWeek = patchEventStatus(state.thisWeek, id, status);
  state.nextMonth = patchEventStatus(state.nextMonth, id, status);
  state.otherUpcoming = patchEventStatus(state.otherUpcoming, id, status);
  state.past = patchEventStatus(state.past, id, status);
}

function patchAllFavorite(
  state: MemberEventsState,
  id: string,
  isFavorite: boolean,
) {
  state.featured = patchEventFavorite(state.featured, id, isFavorite);
  state.thisWeek = patchEventFavorite(state.thisWeek, id, isFavorite);
  state.nextMonth = patchEventFavorite(state.nextMonth, id, isFavorite);
  state.otherUpcoming = patchEventFavorite(state.otherUpcoming, id, isFavorite);
  state.past = patchEventFavorite(state.past, id, isFavorite);
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const memberEventsSlice = createSlice({
  name: "memberEvents",
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<EventFilter>) {
      state.activeFilter = action.payload;
    },
    clearEvents(state) {
      state.featured = [];
      state.thisWeek = [];
      state.nextMonth = [];
      state.otherUpcoming = [];
      state.past = [];
      state.loaded = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Fetch ──────────────────────────────────────────────────────────────
    builder
      .addCase(fetchMemberEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.loaded = true;
        state.featured = action.payload.featured;
        state.thisWeek = action.payload.thisWeek;
        state.nextMonth = action.payload.nextMonth;
        state.otherUpcoming = action.payload.otherUpcoming;
        state.past = action.payload.past;
      })
      .addCase(fetchMemberEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Join ───────────────────────────────────────────────────────────────
    builder
      .addCase(joinEvent.pending, (state, action) => {
        state.rsvpLoading[action.meta.arg] = true;
      })
      .addCase(joinEvent.fulfilled, (state, action) => {
        state.rsvpLoading[action.payload] = false;
        patchAll(state, action.payload, "going");
      })
      .addCase(joinEvent.rejected, (state, action) => {
        state.rsvpLoading[action.meta.arg] = false;
      });

    // ── Leave ──────────────────────────────────────────────────────────────
    builder
      .addCase(leaveEvent.pending, (state, action) => {
        state.rsvpLoading[action.meta.arg] = true;
      })
      .addCase(leaveEvent.fulfilled, (state, action) => {
        state.rsvpLoading[action.payload] = false;
        patchAll(state, action.payload, null);
      })
      .addCase(leaveEvent.rejected, (state, action) => {
        state.rsvpLoading[action.meta.arg] = false;
      });

    // ── Join Waitlist ──────────────────────────────────────────────────────
    builder
      .addCase(joinEventWaitlist.pending, (state, action) => {
        state.rsvpLoading[action.meta.arg] = true;
      })
      .addCase(joinEventWaitlist.fulfilled, (state, action) => {
        state.rsvpLoading[action.payload] = false;
      })
      .addCase(joinEventWaitlist.rejected, (state, action) => {
        state.rsvpLoading[action.meta.arg] = false;
      });

    // ── Toggle Favorite ────────────────────────────────────────────────────
    builder
      .addCase(toggleFavoriteEvent.pending, (state, action) => {
        state.favoriteLoading[action.meta.arg.id] = true;
      })
      .addCase(toggleFavoriteEvent.fulfilled, (state, action) => {
        state.favoriteLoading[action.payload.id] = false;
        patchAllFavorite(state, action.payload.id, action.payload.isFavorite);
      })
      .addCase(toggleFavoriteEvent.rejected, (state, action) => {
        state.favoriteLoading[action.meta.arg.id] = false;
      });
  },
});

export const { setFilter, clearEvents } = memberEventsSlice.actions;
export default memberEventsSlice.reducer;
