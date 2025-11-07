import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

export const memberSlice = createSlice({
  name: "member",
  initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;
      return state;
    },
    logout: () => {
      return initialState;
    },
  },
});

// Action creators are generated for each case reducer function
export const { login, logout } = memberSlice.actions;

export default memberSlice.reducer;
