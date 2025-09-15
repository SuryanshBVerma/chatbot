import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  role: string;
  content_eng: string;
  content_kan: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
  pinned: boolean;
  folder: string;
  messages: Message[];
}

interface ConversationState {
  current: Conversation | null;
}


const initialState: ConversationState = {
  current: {
    id: "c1",
    title: "New Chat",
    updatedAt: new Date(Date.now()).toISOString(),
    messageCount: 0,
    preview: "",
    pinned: false,
    folder: "",
    messages: [],
  },
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setCurrentConversation(state, action: PayloadAction<Conversation>) {
      state.current = action.payload;
    },
    updateMessages(state, action: PayloadAction<Message[]>) {
      if (state.current) {
        state.current.messages = action.payload;
      }
    },
  },
});

export const { setCurrentConversation, updateMessages } = conversationSlice.actions;
export default conversationSlice.reducer;