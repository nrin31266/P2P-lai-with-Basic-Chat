import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface IOnlineUserDto{
  userId: string;
  isOnline: boolean;
}

interface OnlineUserState {
  onlineUsers: { [userId: string]: IOnlineUserDto };
  loading: {
    fetchOnlineUsers: "idle" | "pending" | "succeeded" | "failed";
  }
  errors:{
    fetchOnlineUsers: string | null;
  }
}
const initialState: OnlineUserState = {
  onlineUsers: {},
  loading: {
    fetchOnlineUsers: "idle",
  },
  errors: {
    fetchOnlineUsers: null,
  },
};

const fetchOnlineUsers = createAsyncThunk(
  "onlineUsers/fetchOnlineUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<string[]>(`${import.meta.env.VITE_SERVER_URL}/api/users/online-users`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const onlineUserSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    setOnlineUsers(state, action: PayloadAction<{ userIds: string[], authUserId: string }>) {
      const onlineUsers: { [userId: string]: IOnlineUserDto } = {};
      action.payload.userIds.filter(id => id !== action.payload.authUserId).forEach(userId => {
        onlineUsers[userId] = { userId, isOnline: true };
      });
      state.onlineUsers = onlineUsers;
    },
    updateUserStatus(state, action: PayloadAction<IOnlineUserDto>) {
      const { userId, isOnline } = action.payload;
      if (state.onlineUsers[userId]) {
        state.onlineUsers[userId].isOnline = isOnline;
      } else {
        state.onlineUsers[userId] = { userId, isOnline };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnlineUsers.pending, (state) => {
        state.loading.fetchOnlineUsers = "pending";
        state.errors.fetchOnlineUsers = null;
      })
      .addCase(fetchOnlineUsers.fulfilled, (state) => {
        state.loading.fetchOnlineUsers = "succeeded";
        state.errors.fetchOnlineUsers = null;
      })
      .addCase(fetchOnlineUsers.rejected, (state, action) => {
        state.loading.fetchOnlineUsers = "failed";
        state.errors.fetchOnlineUsers = action.payload as string;
      });
  },
});

export { fetchOnlineUsers };
export const { setOnlineUsers, updateUserStatus } = onlineUserSlice.actions;
export default onlineUserSlice.reducer;