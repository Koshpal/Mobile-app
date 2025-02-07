import { configureStore } from '@reduxjs/toolkit';
import permissionReducer from './slices/permissionSlice';
import messageReducer from './slices/messageSlice';

export const store = configureStore({
  reducer: {
    permissions: permissionReducer,
    messages: messageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 