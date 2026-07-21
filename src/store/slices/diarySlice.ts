/**
 * Minimal slice that tracks when the member diary was last invalidated.
 * MemberDiary watches `invalidatedAt` and refetches whenever it changes.
 */
import { createSlice } from "@reduxjs/toolkit";

type DiaryState = {
  /** Unix ms timestamp of the last invalidation — 0 means never invalidated */
  invalidatedAt: number;
};

const initialState: DiaryState = {
  invalidatedAt: 0,
};

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    /** Call this after any action that creates new diary-worthy content. */
    invalidateDiary: (state) => {
      state.invalidatedAt = Date.now();
    },
  },
});

export const { invalidateDiary } = diarySlice.actions;
export default diarySlice.reducer;
