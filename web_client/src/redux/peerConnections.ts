// redux/peerConnectionsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import SimplePeer from "simple-peer";

export interface PeerConnection {
  userId: string;
  connected: boolean;
}

interface PeerConnectionsState {
  connections: PeerConnection[];
}

const initialState: PeerConnectionsState = {
  connections: [],
};

const peerConnectionsSlice = createSlice({
  name: "peerConnections",
  initialState,
  reducers: {
    addPeerConnection: (state, action: PayloadAction<PeerConnection>) => {
      // Chỉ thêm nếu chưa tồn tại
      if (
        !state.connections.find((conn) => conn.userId === action.payload.userId)
      ) {
        state.connections.push(action.payload);
      }
    },
    removePeerConnection: (state, action: PayloadAction<string>) => {
      state.connections = state.connections.filter(
        (conn) => conn.userId !== action.payload
      );
    },
    updatePeerStatus: (
      state,
      action: PayloadAction<{ userId: string; connected: boolean }>
    ) => {
      const conn = state.connections.find(
        (c) => c.userId === action.payload.userId
      );
      if (conn) {
        conn.connected = action.payload.connected;
      }
    },
    clearAllConnections: (state) => {
      state.connections = [];
    },
  },
});

export const { addPeerConnection, removePeerConnection, clearAllConnections, updatePeerStatus } =
  peerConnectionsSlice.actions;
export default peerConnectionsSlice.reducer;
