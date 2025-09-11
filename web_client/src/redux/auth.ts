import { createSlice } from "@reduxjs/toolkit";

const initialState : { user: { userId: string } | null } = { user: null };

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        clearUser(state) {
            state = initialState;
            return state;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;