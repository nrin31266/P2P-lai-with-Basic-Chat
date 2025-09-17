import { createSlice } from "@reduxjs/toolkit";
import type { IMessage } from "../feature/chat/components/MessageItem";

interface ChatState {
  conversations: {
    [id: string]: {
      messages: IMessage[];
      participants: { userId: string; lastReadAt: string | null }[];
    };
  };
}

const initialState: ChatState = {
  conversations: {},
};
const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: { payload: { message: IMessage } }) => {
        const { message } = action.payload;
        const id1 = message.senderId+":"+message.receiverId;
        const id2 = message.receiverId+":"+message.senderId;
        const conversationId = state.conversations[id1] ? id1 : (state.conversations[id2] ? id2 : id1);
        if(!state.conversations[conversationId]){
          state.conversations[conversationId] = {
            messages: [],
            participants: [
              { userId: message.senderId, lastReadAt: null },
              { userId: message.receiverId, lastReadAt: null }
            ]
          };
        }
        state.conversations[conversationId].messages.push(message);
    }
  }
});
export default chatSlice.reducer;
export const { addMessage } = chatSlice.actions;