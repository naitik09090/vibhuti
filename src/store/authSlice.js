import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('vibhuti_token');
const user = localStorage.getItem('vibhuti_user') 
  ? JSON.parse(localStorage.getItem('vibhuti_user')) 
  : null;

const initialState = {
  user: user,
  token: token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('vibhuti_token', action.payload.token);
      localStorage.setItem('vibhuti_user', JSON.stringify(action.payload.user));
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('vibhuti_token');
      localStorage.removeItem('vibhuti_user');
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('vibhuti_user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { authStart, authSuccess, authFailure, logout, updateProfile, clearError } = authSlice.actions;
export default authSlice.reducer;
