import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('vibhuti_token');
const user = localStorage.getItem('vibhuti_user') 
  ? JSON.parse(localStorage.getItem('vibhuti_user')) 
  : null;

const adminToken = localStorage.getItem('vibhuti_admin_token');
const adminUser = localStorage.getItem('vibhuti_admin_user')
  ? JSON.parse(localStorage.getItem('vibhuti_admin_user'))
  : null;

const initialState = {
  // Customer Session
  user: user,
  token: token,
  isAuthenticated: !!token,
  
  // Admin Session
  adminUser: adminUser,
  adminToken: adminToken,
  isAdminAuthenticated: !!adminToken,

  loading: false,
  error: null,
  
  adminLoading: false,
  adminError: null,
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
    },

    // Admin Specific Reducers
    adminAuthStart: (state) => {
      state.adminLoading = true;
      state.adminError = null;
    },
    adminAuthSuccess: (state, action) => {
      state.adminLoading = false;
      state.isAdminAuthenticated = true;
      state.adminUser = action.payload.user;
      state.adminToken = action.payload.token;
      state.adminError = null;
      localStorage.setItem('vibhuti_admin_token', action.payload.token);
      localStorage.setItem('vibhuti_admin_user', JSON.stringify(action.payload.user));
    },
    adminAuthFailure: (state, action) => {
      state.adminLoading = false;
      state.isAdminAuthenticated = false;
      state.adminUser = null;
      state.adminToken = null;
      state.adminError = action.payload;
    },
    adminLogout: (state) => {
      state.adminLoading = false;
      state.isAdminAuthenticated = false;
      state.adminUser = null;
      state.adminToken = null;
      state.adminError = null;
      localStorage.removeItem('vibhuti_admin_token');
      localStorage.removeItem('vibhuti_admin_user');
    },
    adminClearError: (state) => {
      state.adminError = null;
    }
  },
});

export const {
  authStart, authSuccess, authFailure, logout, updateProfile, clearError,
  adminAuthStart, adminAuthSuccess, adminAuthFailure, adminLogout, adminClearError
} = authSlice.actions;
export default authSlice.reducer;
