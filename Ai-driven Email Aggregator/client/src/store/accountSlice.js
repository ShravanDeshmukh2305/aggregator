import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/accounts');
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addAccount = createAsyncThunk(
  'accounts/addAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await api.post('/accounts', accountData);
      return response;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async (accountId, { rejectWithValue }) => {
    try {
      await api.delete(`/accounts/${accountId}`);
      return accountId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(addAccount.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.items = state.items.filter(account => account._id !== action.payload);
      });
  },
});

export default accountSlice.reducer;