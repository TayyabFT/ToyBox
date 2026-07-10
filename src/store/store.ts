import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/store/slices/adminSlice";
import authReducer from "@/store/slices/authSlice";
import memberDashboardReducer from "@/store/slices/memberDashboardSlice";
import memberEventsReducer from "@/store/slices/memberEventsSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
    memberDashboard: memberDashboardReducer,
    memberEvents: memberEventsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

