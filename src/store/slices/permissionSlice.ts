import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PermissionState {
  sms: boolean;
  notifications: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  sms: false,
  notifications: false,
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setSmsPermission: (state, action: PayloadAction<boolean>) => {
      state.sms = action.payload;
    },
    setNotificationPermission: (state, action: PayloadAction<boolean>) => {
      state.notifications = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setSmsPermission,
  setNotificationPermission,
  setLoading,
  setError,
} = permissionSlice.actions;
export default permissionSlice.reducer; 