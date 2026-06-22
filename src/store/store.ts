import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "@/store/slices/adminSlice";
import authReducer from "@/store/slices/authSlice";
import notificationsReducer from "@/store/slices/notificationsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
